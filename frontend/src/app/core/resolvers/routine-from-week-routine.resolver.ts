import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { RoutineModel } from '@core/models/routine/routine.model';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutineFromWeekRoutineResolver implements Resolve<RoutineModel> {
  constructor(private weekRoutineService: WeekRoutinesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoutineModel> {
    const weekRoutineId = route.paramMap.get('weekRoutineId') as string;
    const day = route.paramMap.get('day') as DayOfWeek;
    const routineId = route.paramMap.get('routineId') as string;
    return this.weekRoutineService.getRoutine(weekRoutineId, day, routineId);
  }
}
