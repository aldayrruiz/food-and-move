import { ApiProperty } from '@nestjs/swagger';
import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FilterConsultDto } from './filter-consult.dto';

export class QueryConsultDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterConsultDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterConsultDto;
}
