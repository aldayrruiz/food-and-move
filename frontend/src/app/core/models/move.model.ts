import { Rating } from '@core/enums/rating';
import { RoutineModel } from './routine.model';

export interface MoveModel extends RoutineModel {
  patient: string;
  date: Date;
  comments?: string;
  done?: boolean;
  rating?: Rating;
}
