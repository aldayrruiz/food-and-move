import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PatientModel } from '@core/models/patient/patient.model';
import { PatientsService } from '@core/services/api/patients.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientResolver implements Resolve<PatientModel> {
  constructor(private patientsService: PatientsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PatientModel> {
    const patientId = route.paramMap.get('patientId');
    if (!patientId) throw new Error('No se ha encontrado el id del paciente');
    return this.patientsService.getPatient(patientId);
  }
}
