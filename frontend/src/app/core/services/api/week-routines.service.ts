import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DayOfWeek } from '@core/enums/day-of-week';
import { CustomQuery } from '@core/interfaces/custom-query';
import { CustomResponse } from '@core/interfaces/custom-response';
import { RecipeRequestModel } from '@core/models/recipe/recipe-request.model';
import { RecipeModel } from '@core/models/recipe/recipe.model';
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

  getRecipe(dietId: string, day: DayOfWeek, recipeId: string): Observable<RecipeModel> {
    return this.http.get<RecipeModel>(
      `${environment.api}/week-routines/getRecipe/${dietId}/${day}/${recipeId}`
    );
  }

  addRecipe(
    dietId: string,
    day: DayOfWeek,
    recipe: RecipeRequestModel
  ): Observable<WeekRoutineModel> {
    return this.http.post<WeekRoutineModel>(
      `${environment.api}/week-routines/addRecipe/${dietId}/${day}`,
      recipe
    );
  }

  updateRecipe(
    dietId: string,
    day: DayOfWeek,
    recipeId: string,
    recipeRequest: RecipeRequestModel
  ): Observable<WeekRoutineModel> {
    return this.http.patch<WeekRoutineModel>(
      `${environment.api}/week-routines/updateRecipe/${dietId}/${day}/${recipeId}`,
      recipeRequest
    );
  }

  removeRecipe(dietId: string, day: DayOfWeek, recipeId: string): Observable<WeekRoutineModel> {
    return this.http.delete<WeekRoutineModel>(
      `${environment.api}/week-routines/removeRecipe/${dietId}/${day}/${recipeId}`
    );
  }
}
