import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DietModel } from '@core/models/diet/diet';
import { DietsService } from '@core/services/api/diets.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietResolver implements Resolve<DietModel> {
  constructor(private dietsService: DietsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DietModel> {
    const dietId = route.paramMap.get('dietId');
    if (!dietId) throw new Error('No se ha encontrado el id de la dieta');
    return this.dietsService.getDiet(dietId);
  }
}
