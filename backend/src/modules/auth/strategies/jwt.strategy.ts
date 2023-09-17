import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {EmployeesService} from "@modules/employees/employees.service";
import {PatientsService} from "@modules/patients/patients.service";
import {Role} from "@modules/auth/enums/role.enum";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService, private readonly employeeService: EmployeesService, private readonly patientsService: PatientsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload?.sub;
    let user;
    if (payload?.role === 'patient') {
      user = await this.patientsService.findById(userId);
      user.roles = [Role.Patient];
    } else {
      user = await this.employeeService.findOne(userId);
      user.roles = [Role.Employee];
      if (user.admin) {
        user.roles.push(Role.Admin);
      }
    }
    if (!user) throw new Error('Employee not found');
    return user;
  }
}
