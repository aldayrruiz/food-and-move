import { PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { RecipeDto } from './recipe.dto';

export class FilterRecipeDto extends PartialType(RecipeDto) {
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @IsOptional()
  title: string;
}
