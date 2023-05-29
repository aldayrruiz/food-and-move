import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CustomQueryDto } from 'src/shared/dto/custom-query.dto';
import { FilterEmployeeDto } from './filter-employee.dto';

export class QueryEmployeeDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterEmployeeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterEmployeeDto;
}
