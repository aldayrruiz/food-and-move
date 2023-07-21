import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { DietsService } from '@core/services/api/diets.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeFromDietResolver implements Resolve<RecipeModel> {
  constructor(private dietsService: DietsService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RecipeModel> {
    const dietId = route.paramMap.get('dietId');
    const recipeId = route.paramMap.get('recipeId');
    const day = route.paramMap.get('day');
    if (dietId && recipeId && day) {
      // @ts-ignore
      return this.dietsService.getRecipe(dietId, day, recipeId);
    }
    throw new Error('No se ha encontrado el id de la receta');
  }
}
