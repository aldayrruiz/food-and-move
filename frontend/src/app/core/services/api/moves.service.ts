import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateRange } from '@core/interfaces/date-range';
import { MovePipe } from '@shared/pipes/move.pipe';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MoveRequestModel } from '../../models/move/move-request.model';
import { MoveModel } from '../../models/move/move.model';

@Injectable({
  providedIn: 'root',
})
export class MovesService {
  constructor(private readonly http: HttpClient, private readonly movePipe: MovePipe) {}

  getMove(id: string): Observable<MoveModel> {
    return this.http.get<MoveModel>(`${environment.api}/moves/${id}`).pipe(
      map((move) => {
        return this.movePipe.transform(move);
      })
    );
  }

  getMoves(patient: string, dateRange: DateRange): Observable<MoveModel[]> {
    return this.http.post<MoveModel[]>(`${environment.api}/moves/findByPatient/${patient}`, dateRange).pipe(
      map((data) => {
        return data.map((food: MoveModel) => {
          return this.movePipe.transform(food);
        });
      })
    );
  }

  createMove(foodRequest: MoveRequestModel): Observable<MoveModel> {
    return this.http.post<MoveModel>(`${environment.api}/moves/create`, foodRequest).pipe(
      map((move) => {
        return this.movePipe.transform(move);
      })
    );
  }

  updateMove(id: string, foodRequest: MoveRequestModel): Observable<MoveModel> {
    return this.http.patch<MoveModel>(`${environment.api}/moves/update/${id}`, foodRequest).pipe(
      map((move) => {
        return this.movePipe.transform(move);
      })
    );
  }

  removeMove(id: string): Observable<MoveModel> {
    return this.http.delete<MoveModel>(`${environment.api}/moves/remove/${id}`).pipe(
      map((move) => {
        return this.movePipe.transform(move);
      })
    );
  }
}
