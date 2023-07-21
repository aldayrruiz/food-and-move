import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeComponentsModule } from '@modules/recipes/components/recipe-components.module';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { AddDietComponent } from './components/add-diet/add-diet.component';
import { DietsRoutingModule } from './diets-routing.module';
import { DietsComponent } from './diets.component';
import { AddRecipeForDietPageComponent } from './pages/add-recipe-for-diet-page/add-recipe-for-diet-page.component';
import { DietsPageComponent } from './pages/diets-page/diets-page.component';
import { EditDietPageComponent } from './pages/edit-diet-page/edit-diet-page.component';

@NgModule({
  declarations: [
    DietsComponent,
    DietsPageComponent,
    AddDietComponent,
    EditDietPageComponent,
    AddRecipeForDietPageComponent,
  ],
  imports: [
    CommonModule,
    DietsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
    RecipeComponentsModule,
  ],
})
export class DietsModule {}
