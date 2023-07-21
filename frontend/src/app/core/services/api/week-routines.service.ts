import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DayOfWeek } from '@core/enums/day-of-week';
import { CustomQuery } from '@core/interfaces/custom-query';
import { CustomResponse } from '@core/interfaces/custom-response';
import { RoutineRequestModel } from '@core/models/routine/routine-request.model';
import { RoutineModel } from '@core/models/routine/routine.model';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { WeekRoutineRequest } from '@core/models/week-routine/week-routine.request';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeekRoutinesService {
  constructor(private readonly http: HttpClient) {}

  getById(id: string): Observable<WeekRoutineModel> {
    return this.http.get<WeekRoutineModel>(`${environment.api}/week-routines/${id}`);
  }

  filter(customQuery: CustomQuery): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${environment.api}/week-routines/filter`, customQuery);
  }

  create(dietRequest: WeekRoutineRequest): Observable<WeekRoutineModel> {
    return this.http.post<WeekRoutineModel>(`${environment.api}/week-routines/`, dietRequest);
  }

  update(id: string, dietRequest: WeekRoutineRequest): Observable<WeekRoutineModel> {
    return this.http.patch<WeekRoutineModel>(`${environment.api}/week-routines/${id}`, dietRequest);
  }

  remove(id: string): Observable<WeekRoutineModel> {
    return this.http.delete<WeekRoutineModel>(`${environment.api}/week-routines/${id}`);
  }

  getRoutine(weekRoutineId: string, day: DayOfWeek, routineId: string): Observable<RoutineModel> {
    const url = `${environment.api}/week-routines/getRoutine`;
    const params = new HttpParams().set('weekRoutineId', weekRoutineId).set('day', day).set('routineId', routineId);
    return this.http.get<RoutineModel>(url, { params });
  }

  addRoutine(weekRoutineId: string, day: DayOfWeek, routine: RoutineRequestModel): Observable<WeekRoutineModel> {
    const url = `${environment.api}/week-routines/addRoutine`;
    const params = new HttpParams().set('weekRoutineId', weekRoutineId).set('day', day);
    return this.http.post<WeekRoutineModel>(url, routine, { params });
  }

  updateRoutine(
    weekRoutineId: string,
    day: DayOfWeek,
    routineId: string,
    newRoutine: RoutineRequestModel
  ): Observable<WeekRoutineModel> {
    const params = new HttpParams().set('weekRoutineId', weekRoutineId).set('day', day).set('routineId', routineId);
    const url = `${environment.api}/week-routines/updateRoutine`;
    return this.http.patch<WeekRoutineModel>(url, newRoutine, { params });
  }

  removeRoutine(weekRoutineId: string, day: DayOfWeek, routineId: string): Observable<WeekRoutineModel> {
    const params = new HttpParams().set('weekRoutineId', weekRoutineId).set('day', day).set('routineId', routineId);
    const url = `${environment.api}/week-routines/removeRoutine`;
    return this.http.delete<WeekRoutineModel>(url, { params });
  }
}
