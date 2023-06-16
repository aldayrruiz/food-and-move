import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FilterEmployeeDto } from './filter-employee.dto';

export class QueryEmployeeDto extends CustomQueryDto {
  @Type(() => FilterEmployeeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterEmployeeDto;
}
