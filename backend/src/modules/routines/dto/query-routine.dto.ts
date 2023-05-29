import { ApiProperty } from '@nestjs/swagger';
import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FilterRoutineDto } from './filter-routine.dto';

export class QueryRoutineDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterRoutineDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterRoutineDto;
}
