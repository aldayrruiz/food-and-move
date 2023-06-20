import { IsMongoId, IsNotEmpty } from 'class-validator';

export class LinkPatientDto {
  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;

  @IsNotEmpty()
  @IsMongoId()
  patientId: string;
}
