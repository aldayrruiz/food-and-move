import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ConsultModel } from '@core/models/consult/consult.model';
import { ConsultsService } from '@core/services/api/consults.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultResolver implements Resolve<ConsultModel> {
  constructor(private consultsService: ConsultsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ConsultModel> {
    const consultId = route.paramMap.get('consultId');
    if (!consultId) throw new Error('No se ha encontrado el id de la consulta');
    return this.consultsService.getConsult(consultId);
  }
}
