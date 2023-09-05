import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RoutineModel } from '@core/models/routine/routine.model';
import { RoutinesService } from '@core/services/api/routines.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutineResolver implements Resolve<RoutineModel> {
  constructor(private routineService: RoutinesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoutineModel> {
    const routineId = route.paramMap.get('routineId');
    if (!routineId) throw new Error('No se ha encontrado el id de la rutina');
    return this.routineService.getRoutine(routineId);
  }
}
