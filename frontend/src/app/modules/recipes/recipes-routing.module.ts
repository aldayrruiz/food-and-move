import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeResolver } from '@core/resolvers/recipe.resolver';
import { AddRecipePageComponent } from './pages/add-recipe-page/add-recipe-page.component';
import { RecipesPageComponent } from './pages/recipes-page/recipes-page.component';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    children: [
      { path: '', component: RecipesPageComponent },
      { path: 'add-recipe', component: AddRecipePageComponent },
      {
        path: 'edit-recipe/:recipeId',
        component: AddRecipePageComponent,
        resolve: {
          recipe: RecipeResolver,
        },
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
