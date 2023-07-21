import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormRecipeComponent } from '@modules/recipes/components/form-recipe/form-recipe.component';
import { InfoRecipeComponent } from '@modules/recipes/components/info-recipe/info-recipe.component';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [FormRecipeComponent, InfoRecipeComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatModule, SharedModule],
  exports: [FormRecipeComponent, InfoRecipeComponent],
})
export class RecipeComponentsModule {}
