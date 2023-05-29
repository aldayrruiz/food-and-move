import { Injectable } from '@angular/core';
import { PatientModel } from '@core/models/patient.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientsService } from './patients.service';

@Injectable({
  providedIn: 'root',
})
export class ViewPatientService {
  private patient = new BehaviorSubject<PatientModel | null>(null);
  public patient$: Observable<PatientModel | null> = this.patient;

  constructor(private readonly patientsService: PatientsService) {}

  async updatePatient(id: string): Promise<void> {
    await this.patientsService.getPatient(id).subscribe(
      (res) => {
        this.patient.next(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
