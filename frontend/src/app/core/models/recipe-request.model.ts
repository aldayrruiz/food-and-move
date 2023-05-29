import { Dish } from '../enums/dish';
import { Meal } from '../enums/meal';
import { IngredientRequestModel } from './ingredient-request.model';

export interface RecipeRequestModel {
  title: string;
  description?: string;
  meal: Meal;
  dish: Dish;
  links: string[];
  videos: string[];
  ingredients: IngredientRequestModel[];
  attachment?: string;
}
