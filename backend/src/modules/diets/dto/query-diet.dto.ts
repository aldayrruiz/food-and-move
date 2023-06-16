import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FilterDietDto } from './filter-diet.dto';

export class QueryDietDto extends CustomQueryDto {
  @Type(() => FilterDietDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterDietDto;
}
