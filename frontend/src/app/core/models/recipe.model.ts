import { Dish } from '../enums/dish';
import { Meal } from '../enums/meal';
import { IngredientModel } from './ingredient.model';

export interface RecipeModel {
  _id: string;
  title: string;
  description?: string;
  meal: Meal;
  dish: Dish;
  links: string[];
  videos: string[];
  ingredients: IngredientModel[];
  attachment?: string;
}
