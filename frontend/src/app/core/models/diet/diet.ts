import { RecipeModel } from '../recipe/recipe.model';

export interface DietModel {
  _id: string;
  title: string;
  description?: string;
  monday: RecipeModel[];
  tuesday: RecipeModel[];
  wednesday: RecipeModel[];
  thursday: RecipeModel[];
  friday: RecipeModel[];
  saturday: RecipeModel[];
  sunday: RecipeModel[];
}
