import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { RecipesService } from '@core/services/api/recipes.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolver implements Resolve<RecipeModel> {
  constructor(private recipesService: RecipesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RecipeModel> {
    const recipeId = route.paramMap.get('recipeId');
    if (!recipeId) throw new Error('No se ha encontrado el id de la receta');
    return this.recipesService.getRecipe(recipeId);
  }
}
