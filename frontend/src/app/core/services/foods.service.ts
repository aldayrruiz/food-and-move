import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FoodModel } from '@core/models/food.model';
import { FoodPipe } from '@shared/pipes/food.pipe';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateRange } from '../interfaces/date-range';
import { FoodRequestModel } from '../models/food-request.model';

@Injectable({
  providedIn: 'root',
})
export class FoodsService {
  constructor(private readonly http: HttpClient, private readonly foodPipe: FoodPipe) {}

  getFood(id: string): Observable<FoodModel> {
    return this.http.get<FoodModel>(`${environment.api}/foods/${id}`).pipe(
      map((food) => {
        return this.foodPipe.transform(food);
      })
    );
  }

  getFoods(patient: string, dateRange: DateRange): Observable<FoodModel[]> {
    return this.http
      .post<FoodModel[]>(`${environment.api}/foods/findByPatient/${patient}`, dateRange)
      .pipe(
        map((data) => {
          return data.map((food: FoodModel) => {
            return this.foodPipe.transform(food);
          });
        })
      );
  }

  getLastAssignedFoods(patient: string, limitDate: string): Observable<FoodModel[]> {
    return this.http
      .get<FoodModel[]>(`${environment.api}/foods/lastAssigned/${patient}?limitDate=${limitDate}`)
      .pipe(
        map((data) => {
          return data.map((food: FoodModel) => {
            return this.foodPipe.transform(food);
          });
        })
      );
  }

  createFood(foodRequest: FoodRequestModel): Observable<FoodModel> {
    return this.http.post<FoodModel>(`${environment.api}/foods/create`, foodRequest).pipe(
      map((food) => {
        return this.foodPipe.transform(food);
      })
    );
  }

  updateFood(id: string, foodRequest: FoodRequestModel): Observable<FoodModel> {
    return this.http.patch<FoodModel>(`${environment.api}/foods/update/${id}`, foodRequest).pipe(
      map((food) => {
        return this.foodPipe.transform(food);
      })
    );
  }

  removeFood(id: string): Observable<FoodModel> {
    return this.http.delete<FoodModel>(`${environment.api}/foods/remove/${id}`).pipe(
      map((food) => {
        return this.foodPipe.transform(food);
      })
    );
  }

  clearFoods(patientId: string, dateRange: DateRange): Observable<FoodModel[]> {
    return this.http
      .post<FoodModel[]>(`${environment.api}/foods/clearFoods/${patientId}`, dateRange)
      .pipe(
        map((data) => {
          return data.map((food: FoodModel) => {
            return this.foodPipe.transform(food);
          });
        })
      );
  }

  importDiet(dietId: string, patientId: string, date: Date): Observable<FoodModel[]> {
    return this.http
      .get<FoodModel[]>(`${environment.api}/foods/importDiet/${dietId}/${patientId}/${date}`)
      .pipe(
        map((data) => {
          return data.map((food: FoodModel) => {
            return this.foodPipe.transform(food);
          });
        })
      );
  }
}
