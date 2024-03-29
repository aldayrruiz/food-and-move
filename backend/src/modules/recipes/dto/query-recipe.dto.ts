import { CustomQueryDto } from '@shared/dto/custom-query.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FilterRecipeDto } from './filter-recipe.dto';

export class QueryRecipeDto extends CustomQueryDto {
  @Type(() => FilterRecipeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterRecipeDto;
}
