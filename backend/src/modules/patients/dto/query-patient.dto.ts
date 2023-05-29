import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CustomQueryDto } from 'src/shared/dto/custom-query.dto';
import { FilterPatientDto } from './filter-patient.dto';

export class QueryPatientDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterPatientDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterPatientDto;
}
