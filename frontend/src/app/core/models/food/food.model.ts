import { Rating } from '../../enums/rating';
import { RecipeModel } from '../recipe/recipe.model';

export interface FoodModel extends RecipeModel {
  patient: string;
  comments?: string;
  date: Date;
  done?: boolean;
  rating?: Rating;
}
