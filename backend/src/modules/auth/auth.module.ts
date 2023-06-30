import { AuthEmployeeController } from '@modules/auth/controllers/auth-employee.controller';
import { HashingModule } from '@modules/auth/hashing.module';
import { AuthEmployeeService } from '@modules/auth/services/auth-employee.service';
import { JwtAccessStrategy } from '@modules/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@modules/auth/strategies/refresh-token.strategy';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { EmployeesModule } from '../employees/employees.module';
import { PatientsModule } from '../patients/patients.module';
import { AuthPatientController } from './controllers/auth-patient.controller';
import { AuthPatientService } from './services/auth-patient.service';

@Module({
  imports: [PassportModule, JwtModule.register({}), PatientsModule, EmployeesModule, HashingModule],
  providers: [
    AuthPatientService,
    AuthEmployeeService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthPatientController, AuthEmployeeController],
})
export class AuthModule {}
