import { ApiProperty } from '@nestjs/swagger';
import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FilterPatientDto } from './filter-patient.dto';

export class QueryPatientDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterPatientDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterPatientDto;
}
