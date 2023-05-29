import { PartialType } from '@nestjs/swagger';
import { RecipeDto } from './recipe.dto';

export class UpdateRecipeDto extends PartialType(RecipeDto) {}
