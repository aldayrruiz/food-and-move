import { SignInEmployeeDto } from '@modules/auth/dto/sign-in-employee.dto';
import { SignUpEmployeeDto } from '@modules/auth/dto/sign-up-employee.dto';
import { EmailOrPasswordIncorrect } from '@modules/auth/exceptions/email-or-password-incorrect.exception';
import { HashingService } from '@modules/auth/services/hashing.service';
import { EmployeesService } from '@modules/employees/employees.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthEmployeeService {
  constructor(
    private employeesService: EmployeesService,
    private hashingService: HashingService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  /**
   * Create a user and returns access and refresh token.
   *
   * @param signUpDto
   * @returns
   */
  async signUp(signUpDto: SignUpEmployeeDto) {
    const user = await this.employeesService.create(signUpDto);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authUserDto: SignInEmployeeDto) {
    const { email, password } = authUserDto;
    const user = await this.validate(email, password);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async validate(email: string, password: string) {
    try {
      const employee = await this.employeesService.lookUp({ email });
      if (await this.hashingService.verify(password, employee.password)) {
        return employee;
      }
    } catch (error: any) {
      throw new EmailOrPasswordIncorrect();
    }
  }

  async logout(userId: string) {
    return this.employeesService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashingService.hash(refreshToken);
    await this.employeesService.update(userId, { refreshToken: hashedRefreshToken });
  }

  /**
   * Given userId and email, access and refresh token are returned.
   *
   * @param userId User id
   * @param email User email
   * @returns access and refresh token
   */
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: 'employee',
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: 'employee',
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        }
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Check if user & user refresh token exists
    const employee = await this.employeesService.findOne(userId);
    if (!employee || !employee.refreshToken) throw new ForbiddenException('Access Denied');

    // Verify refresh token passed & refresh token stored match
    const refreshTokenMatches = this.hashingService.verify(employee.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    // Generate & return new tokens
    const tokens = await this.getTokens(employee.id, employee.email);
    await this.updateRefreshToken(employee.id, tokens.refreshToken);
    return tokens;
  }
}
