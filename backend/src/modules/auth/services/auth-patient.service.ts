import { SignInPatientDto } from '@modules/auth/dto/sign-in-patient.dto';
import { SignUpPatientDto } from '@modules/auth/dto/sign-up-patient.dto';
import { EmailOrPasswordIncorrect } from '@modules/auth/exceptions/email-or-password-incorrect.exception';
import { HashingService } from '@modules/auth/services/hashing.service';
import { PatientsService } from '@modules/patients/patients.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthPatientService {
  constructor(
    private patientsService: PatientsService,
    private hashingService: HashingService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpPatientDto) {
    const patient = await this.patientsService.create(signUpDto);
    const tokens = await this.getTokens(patient.id, patient.phone);
    await this.updateRefreshToken(patient.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authUserDto: SignInPatientDto) {
    const { phone, password } = authUserDto;
    const user = await this.validate(phone, password);
    const tokens = await this.getTokens(user.id, user.phone);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async validate(phone: string, password: string) {
    try {
      const employee = await this.patientsService.lookUp({ phone });
      if (await this.hashingService.verify(password, employee.password)) {
        return employee;
      }
    } catch (error: any) {
      throw new EmailOrPasswordIncorrect();
    }
  }

  async logout(userId: string) {
    return this.patientsService.update(userId, { refreshToken: null });
  }

  /**
   * Updates refresh token given a userId and the refresh token.
   *
   * @param userId User id
   * @param refreshToken Refresh token
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashingService.hash(refreshToken);
    await this.patientsService.update(userId, { refreshToken: hashedRefreshToken });
  }

  /**
   * Given userId and email, access and refresh token are returned.
   *
   * @param userId User id
   * @param phone User phone
   * @returns access and refresh token
   */
  async getTokens(userId: string, phone: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          phone,
          role: 'patient',
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          phone,
          role: 'patient',
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
    const patient = await this.patientsService.findById(userId);
    if (!patient || !patient.refreshToken) throw new ForbiddenException('Access Denied');

    // Verify refresh token passed & refresh token stored match
    const refreshTokenMatches = this.hashingService.verify(patient.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    // Generate & return new tokens
    const tokens = await this.getTokens(patient.id, patient.email);
    await this.updateRefreshToken(patient.id, tokens.refreshToken);
    return tokens;
  }
}
