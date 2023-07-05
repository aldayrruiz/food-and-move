import { URL_FRONT_DEV, URL_FRONT_PROD } from '@constants/app.constants';
import { SignInEmployeeDto } from '@modules/auth/dto/sign-in-employee.dto';
import { SignUpEmployeeDto } from '@modules/auth/dto/sign-up-employee.dto';
import { EmailOrPasswordIncorrect } from '@modules/auth/exceptions/email-or-password-incorrect.exception';
import { HashingService } from '@modules/auth/services/hashing.service';
import { JWT_FORGOT_PASSWORD_CONF } from '@modules/employees/constants/jwt-forgot-password.constants';
import { EmployeesService } from '@modules/employees/employees.service';
import { MailService } from '@modules/mail/mail.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '@shared/dto/change-password.dto';

@Injectable()
export class AuthEmployeeService {
  constructor(
    private employeesService: EmployeesService,
    private hashingService: HashingService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService
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

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { password, newPassword } = changePasswordDto;
    const employee = await this.employeesService.findOne(id);
    const isMatch = await this.hashingService.verify(password, employee.password);
    if (!isMatch) throw new NotFoundException('Contraseña incorrecta');
    const hashPassword = await this.hashingService.hash(newPassword);
    await this.employeesService.updatePassword(id, hashPassword);
  }

  async forgotPassword(email: string) {
    const employee = await this.employeesService.lookUp({ email });
    const token = await this.getForgotPasswordToken(employee.id, email);
    const isProduction = this.configService.get<boolean>('production');
    const baseUrl = isProduction ? URL_FRONT_PROD : URL_FRONT_DEV;
    const url = baseUrl + 'auth/recoverPassword/' + token;
    const time = JWT_FORGOT_PASSWORD_CONF.expiresIn;
    await this.mailService.sendForgotPassword(email, url, time);
    return true;
  }

  async recoverPassword(token: string, password: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
        ignoreExpiration: false,
      });
      const email = payload.email;
      await this.employeesService.lookUp({ email });
      const hashPassword = await this.hashingService.hash(password);
      return await this.employeesService.updatePassword(payload.sub, hashPassword);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Token no válido');
    }
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

  async getForgotPasswordToken(employeeId: string, email: string) {
    return await this.jwtService.signAsync(
      {
        sub: employeeId,
        email,
        role: 'employee',
      },
      {
        secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
        expiresIn: '1h',
      }
    );
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
