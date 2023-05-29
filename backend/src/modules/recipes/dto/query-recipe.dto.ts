import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CustomQueryDto } from 'src/shared/dto/custom-query.dto';
import { FilterRecipeDto } from './filter-recipe.dto';

export class QueryRecipeDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterRecipeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterRecipeDto;
}
