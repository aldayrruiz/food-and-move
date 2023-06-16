import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignPatientDto {
  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;

  @IsNotEmpty()
  @IsMongoId()
  patientId: string;
}
