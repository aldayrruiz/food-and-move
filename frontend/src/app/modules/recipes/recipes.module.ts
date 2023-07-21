import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeComponentsModule } from '@modules/recipes/components/recipe-components.module';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { RecipesComponent } from '../recipes/recipes.component';
import { AddRecipePageComponent } from './pages/add-recipe-page/add-recipe-page.component';
import { RecipesPageComponent } from './pages/recipes-page/recipes-page.component';
import { RecipesRoutingModule } from './recipes-routing.module';

@NgModule({
  declarations: [RecipesPageComponent, RecipesComponent, AddRecipePageComponent],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
    RecipeComponentsModule,
  ],
})
export class RecipesModule {}
