import { PartialType } from '@nestjs/swagger';
import { PatientDto } from './patient.dto';

export class UpdatePatientDto extends PartialType(PatientDto) {}
