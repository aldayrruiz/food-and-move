import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomQuery } from '@core/interfaces/custom-query';
import { CustomResponse } from '@core/interfaces/custom-response';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RecipeRequestModel } from '../../models/recipe/recipe-request.model';
import { RecipeModel } from '../../models/recipe/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private readonly http: HttpClient) {}

  getRecipe(id: string): Observable<RecipeModel> {
    return this.http.get<RecipeModel>(`${environment.api}/recipes/${id}`);
  }

  filter(customQuery: CustomQuery): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${environment.api}/recipes/filter`, customQuery);
  }

  createRecipe(recipe: RecipeRequestModel): Observable<RecipeModel> {
    return this.http.post<RecipeModel>(`${environment.api}/recipes/create`, recipe);
  }

  updateRecipe(id: string, recipe: RecipeRequestModel): Observable<RecipeModel> {
    return this.http.patch<RecipeModel>(`${environment.api}/recipes/update/${id}`, recipe);
  }

  removeRecipe(id: string): Observable<RecipeModel> {
    return this.http.delete<RecipeModel>(`${environment.api}/recipes/remove/${id}`);
  }
}
