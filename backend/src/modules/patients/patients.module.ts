import { EmployeesModule } from '@modules/employees/employees.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultsModule } from 'src/modules/consults/consults.module';
import { FoodsModule } from 'src/modules/foods/foods.module';
import { MovesModule } from 'src/modules/moves/moves.module';
import { CustomQueryService } from 'src/services/custom-query.service';
import { FilesService } from '../files/files.service';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'patients',
        schema: PatientSchema,
      },
    ]),
    ConsultsModule,
    FoodsModule,
    MovesModule,
    EmployeesModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService, CustomQueryService, FilesService],
  exports: [PatientsService],
})
export class PatientsModule {}
