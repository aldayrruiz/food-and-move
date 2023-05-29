import { RecipeModel } from './recipe.model';

export interface DietRequest {
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
