import { PatientsModule } from '@modules/patients/patients.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CustomQueryService } from '../../services/custom-query.service';
import { FilesService } from '../files/files.service';
import { MailModule } from '../mail/mail.module';
import { jwtForgotPassword } from './constants/jwt-forgot-password.constants';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeSchema } from './schema/employee.schema';
import { JwtForgotPasswordStrategy } from './strategys/jwt-forgot-password.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: jwtForgotPassword.secret,
      signOptions: { expiresIn: jwtForgotPassword.expiresIn },
    }),
    MailModule,
    PatientsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, FilesService, CustomQueryService, JwtForgotPasswordStrategy],
  exports: [EmployeesService],
})
export class EmployeesModule {}
