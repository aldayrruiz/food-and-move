import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CustomQueryService } from '@services/custom-query.service';
import { FilesService } from '../files/files.service';
import { MailModule } from '../mail/mail.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeSchema } from './schema/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
    ]),
    PassportModule,
    MailModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, FilesService, CustomQueryService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
