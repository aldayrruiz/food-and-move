import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MoveModel } from '@core/models/move/move.model';
import { MovesService } from '@core/services/api/moves.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoveResolver implements Resolve<MoveModel> {
  constructor(private moveService: MovesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MoveModel> {
    const moveId = route.paramMap.get('moveId');
    if (!moveId) throw new Error('No se ha encontrado el id del ejercicio');
    return this.moveService.getMove(moveId);
  }
}
