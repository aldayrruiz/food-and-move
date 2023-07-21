import { RoutineModel } from '@core/models/routine/routine.model';

export interface WeekRoutineRequest {
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
