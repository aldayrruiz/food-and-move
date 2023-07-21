import { RoutineModel } from '@core/models/routine/routine.model';

export interface WeekRoutineModel {
  _id: string;
  title: string;
  description?: string;
  monday: RoutineModel[];
  tuesday: RoutineModel[];
  wednesday: RoutineModel[];
  thursday: RoutineModel[];
  friday: RoutineModel[];
  saturday: RoutineModel[];
  sunday: RoutineModel[];
}
