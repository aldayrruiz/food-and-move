import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { PatientsService } from '../patients/patients.service';
import { AuthEmployeeDto } from './dto/auth-employee.dto';
import { AuthPatientDto } from './dto/auth-patient.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PatientsService) private readonly patientsService: PatientsService,
    @Inject(EmployeesService) private readonly employeesService: EmployeesService,
    private jwtAuthService: JwtService
  ) {}

  async loginEmployee(authUserDto: AuthEmployeeDto) {
    const { email, password } = authUserDto;
    const user = await this.employeesService.login(email, password);
    const payload = { id: user._id, name: user.name };
    const token = await this.jwtAuthService.sign(payload);
    const data = {
      user,
      token,
    };
    return data;
  }

  async loginPatient(authUserDto: AuthPatientDto) {
    const { phone, password } = authUserDto;
    const user = await this.patientsService.login(phone, password);
    const payload = { id: user._id, name: user.name };
    const token = await this.jwtAuthService.sign(payload);
    const data = {
      user,
      token,
    };
    return data;
  }
}
