import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeekRoutineResolver implements Resolve<WeekRoutineModel> {
  constructor(private weekRoutineService: WeekRoutinesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WeekRoutineModel> {
    const weekRoutineId = route.paramMap.get('weekRoutineId');
    if (!weekRoutineId) throw new Error('No se ha encontrado el id de la rutina semanal');
    return this.weekRoutineService.getById(weekRoutineId);
  }
}
