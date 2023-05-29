import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { PatientDto } from './patient.dto';

export class FilterPatientDto extends PartialType(OmitType(PatientDto, ['password'] as const)) {
  @ApiProperty()
  @IsObjectId()
  @IsOptional()
  _id: string;
}
