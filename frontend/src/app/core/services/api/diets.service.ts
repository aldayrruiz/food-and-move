import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DayOfWeek } from '@core/enums/day-of-week';
import { CustomQuery } from '@core/interfaces/custom-query';
import { CustomResponse } from '@core/interfaces/custom-response';
import { DietModel } from '@core/models/diet/diet';
import { DietRequest } from '@core/models/diet/diet-request.model';
import { RecipeRequestModel } from '@core/models/recipe/recipe-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RecipeModel } from '../../models/recipe/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class DietsService {
  constructor(private readonly http: HttpClient) {}

  getDiet(id: string): Observable<DietModel> {
    return this.http.get<DietModel>(`${environment.api}/diets/${id}`);
  }

  filter(customQuery: CustomQuery): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${environment.api}/diets/filter`, customQuery);
  }

  createDiet(dietRequest: DietRequest): Observable<DietModel> {
    return this.http.post<DietModel>(`${environment.api}/diets/create`, dietRequest);
  }

  updateDiet(id: string, dietRequest: DietRequest): Observable<DietModel> {
    return this.http.patch<DietModel>(`${environment.api}/diets/update/${id}`, dietRequest);
  }

  removeDiet(id: string): Observable<DietModel> {
    return this.http.delete<DietModel>(`${environment.api}/diets/remove/${id}`);
  }

  getRecipe(dietId: string, day: DayOfWeek, recipeId: string): Observable<RecipeModel> {
    return this.http.get<RecipeModel>(
      `${environment.api}/diets/getRecipe/${dietId}/${day}/${recipeId}`
    );
  }

  addRecipe(
    dietId: string,
    day: DayOfWeek,
    recipeRequest: RecipeRequestModel
  ): Observable<DietModel> {
    return this.http.post<DietModel>(
      `${environment.api}/diets/addRecipe/${dietId}/${day}`,
      recipeRequest
    );
  }

  updateRecipe(
    dietId: string,
    day: DayOfWeek,
    recipeId: string,
    recipeRequest: RecipeRequestModel
  ): Observable<DietModel> {
    return this.http.patch<DietModel>(
      `${environment.api}/diets/updateRecipe/${dietId}/${day}/${recipeId}`,
      recipeRequest
    );
  }

  removeRecipe(dietId: string, day: DayOfWeek, recipeId: string): Observable<DietModel> {
    return this.http.delete<DietModel>(
      `${environment.api}/diets/removeRecipe/${dietId}/${day}/${recipeId}`
    );
  }
}
