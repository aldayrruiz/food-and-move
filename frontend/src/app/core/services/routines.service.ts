import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomQuery } from '@core/interfaces/custom-query';
import { CustomResponse } from '@core/interfaces/custom-response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoutineRequestModel } from '../models/routine/routine-request.model';
import { RoutineModel } from '../models/routine/routine.model';

@Injectable({
  providedIn: 'root',
})
export class RoutinesService {
  constructor(private readonly http: HttpClient) {}

  getRoutine(id: string): Observable<RoutineModel> {
    return this.http.get<RoutineModel>(`${environment.api}/routines/${id}`);
  }

  filter(customQuery: CustomQuery): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${environment.api}/routines/filter`, customQuery);
  }

  createRoutine(routine: RoutineRequestModel): Observable<RoutineModel> {
    return this.http.post<RoutineModel>(`${environment.api}/routines/create`, routine);
  }

  updateRoutine(id: string, routine: RoutineRequestModel): Observable<RoutineModel> {
    return this.http.patch<RoutineModel>(`${environment.api}/routines/update/${id}`, routine);
  }

  removeRoutine(id: string): Observable<RoutineModel> {
    return this.http.delete<RoutineModel>(`${environment.api}/routines/remove/${id}`);
  }
}
