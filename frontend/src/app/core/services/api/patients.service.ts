import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomQuery } from '@core/interfaces/custom-query';
import { PatientPipe } from '@shared/pipes/patient.pipe';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CustomResponse } from '../../interfaces/custom-response';
import { PatientRequestModel } from '../../models/patient/patient-request.model';
import { PatientModel } from '../../models/patient/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(private readonly http: HttpClient, private readonly patientPipe: PatientPipe) {}

  getAll() {
    return this.http.get<PatientModel[]>(`${environment.api}/patients`).pipe(
      map((patients) => {
        return patients.map((patient) => this.patientPipe.transform(patient));
      })
    );
  }

  getPatient(id: string): Observable<PatientModel> {
    return this.http.get<PatientModel>(`${environment.api}/patients/${id}`).pipe(
      map((patient) => {
        return this.patientPipe.transform(patient);
      })
    );
  }

  getMyPatients(customQuery: CustomQuery): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${environment.api}/patients/filter`, customQuery).pipe(
      map((data) => {
        const newData: CustomResponse = Object.assign({}, data);
        newData.items.map((patient: PatientModel) => {
          return this.patientPipe.transform(patient);
        });
        return newData;
      })
    );
  }

  filter(customQuery: CustomQuery): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${environment.api}/patients/filter`, customQuery).pipe(
      map((data) => {
        const newData: CustomResponse = Object.assign({}, data);
        newData.items.map((patient: PatientModel) => {
          return this.patientPipe.transform(patient);
        });
        return newData;
      })
    );
  }

  createPatient(patient: PatientRequestModel): Observable<PatientModel> {
    return this.http.post<PatientModel>(`${environment.api}/patients/create`, patient).pipe(
      map((patient) => {
        return this.patientPipe.transform(patient);
      })
    );
  }

  updatePatient(id: string, patient: PatientRequestModel): Observable<PatientModel> {
    return this.http.patch<PatientModel>(`${environment.api}/patients/update/${id}`, patient).pipe(
      map((patient) => {
        return this.patientPipe.transform(patient);
      })
    );
  }

  removePatient(id: string): Observable<PatientModel> {
    return this.http.delete<PatientModel>(`${environment.api}/patients/remove/${id}`).pipe(
      map((patient) => {
        return this.patientPipe.transform(patient);
      })
    );
  }

  uploadProfileImage(id: string, formData: FormData): Observable<PatientModel> {
    return this.http.post<PatientModel>(`${environment.api}/patients/upload/${id}`, formData);
  }

  removeProfileImage(id: string): Observable<PatientModel> {
    return this.http.delete<PatientModel>(`${environment.api}/patients/remove-profile-image/${id}`);
  }

  generateRandomPassword(): Observable<{ password: string }> {
    return this.http.get<{ password: string }>(`${environment.api}/patients/randomPassword`);
  }

  linkEmployeePatient(employeeId: string, patientId: string): Observable<PatientModel> {
    return this.http.post<PatientModel>(`${environment.api}/patients/linkEmployeePatient`, {
      employeeId,
      patientId,
    });
  }

  unlinkEmployeePatient(employeeId: string, patientId: string): Observable<PatientModel> {
    return this.http.post<PatientModel>(`${environment.api}/patients/unlinkEmployeePatient`, {
      employeeId,
      patientId,
    });
  }
}
