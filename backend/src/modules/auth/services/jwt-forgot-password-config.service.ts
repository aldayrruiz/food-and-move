import { JWT_FORGOT_PASSWORD_CONF } from '@modules/employees/constants/jwt-forgot-password.constants';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtForgotPasswordConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
      signOptions: { expiresIn: JWT_FORGOT_PASSWORD_CONF.expiresIn },
    };
  }
}
