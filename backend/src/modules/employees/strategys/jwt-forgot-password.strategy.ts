import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtForgotPassword } from '../constants/jwt-forgot-password.constants';

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: jwtForgotPassword.ignoreExpiration,
      secretOrKey: jwtForgotPassword.secret,
    });
  }

  async validate(payload: any) {
    return { email: payload.email };
  }
}
