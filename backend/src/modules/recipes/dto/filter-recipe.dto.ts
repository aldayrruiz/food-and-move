import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { RecipeDto } from './recipe.dto';

export class FilterRecipeDto extends PartialType(RecipeDto) {
  @ApiProperty()
  @IsObjectId()
  @IsOptional()
  _id: string;
}
