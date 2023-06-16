import { PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { ConsultDto } from './consult.dto';

export class FilterConsultDto extends PartialType(ConsultDto) {
  @IsMongoId()
  @IsOptional()
  _id: string;

  @IsOptional()
  patient: string;

  @IsOptional()
  owner: string;

  @IsOptional()
  created_at: Date;
}
