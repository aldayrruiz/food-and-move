import { FilterWeekRoutineDto } from '@modules/week-routines/dto/filter-week-routine.dto';
import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class QueryWeekRoutineDto extends CustomQueryDto {
  @Type(() => FilterWeekRoutineDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterWeekRoutineDto;
}
