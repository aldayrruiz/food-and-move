import {IsDateString, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";
import {Ingredient} from "@modules/recipes/dto/recipe.dto";

export class CreateShoppingListDto {

  @IsMongoId()
  @IsNotEmpty()
  patient: string;

  @IsDateString()
  date: string;

  @IsOptional()
  ingredients: Ingredient[];
}
