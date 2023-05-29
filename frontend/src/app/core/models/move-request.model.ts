import { Rating } from '@core/enums/rating';
import { RoutineRequestModel } from './routine-request.model';

export interface MoveRequestModel extends RoutineRequestModel {
  patient: string;
  date: Date;
  comments?: string;
  done?: boolean;
  rating?: Rating;
}
