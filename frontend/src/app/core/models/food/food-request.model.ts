import { Rating } from '@core/enums/rating';
import { RecipeRequestModel } from '../recipe/recipe-request.model';

export interface FoodRequestModel extends RecipeRequestModel {
  patient: string;
  comments?: string;
  date: Date;
  done?: boolean;
  rating?: Rating;
}
