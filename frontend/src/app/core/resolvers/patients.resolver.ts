import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PatientModel } from '@core/models/patient/patient.model';
import { PatientsService } from '@core/services/api/patients.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientsResolver implements Resolve<PatientModel[]> {
  constructor(private patientsService: PatientsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PatientModel[]> {
    return this.patientsService.getAll();
  }
}
