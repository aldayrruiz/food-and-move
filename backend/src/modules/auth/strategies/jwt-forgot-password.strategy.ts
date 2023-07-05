import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_FORGOT_PASSWORD_CONF } from '../../employees/constants/jwt-forgot-password.constants';

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(Strategy, 'jwt-forgot-password') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: JWT_FORGOT_PASSWORD_CONF.ignoreExpiration,
      secretOrKey: configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
    });
  }

  async validate(payload: any) {
    return { email: payload.email };
  }
}
