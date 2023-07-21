import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { RecipesService } from '@core/services/api/recipes.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { FormRecipeComponent } from '@modules/recipes/components/form-recipe/form-recipe.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-recipe-page',
  templateUrl: './add-recipe-page.component.html',
  styleUrls: ['./add-recipe-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddRecipePageComponent implements OnInit {
  @ViewChild('formRecipe') formRecipe!: FormRecipeComponent;
  recipe!: RecipeModel;
  edit = false;

  buttonClear = {
    title: false,
    description: false,
  };

  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly recipesService: RecipesService,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService
  ) {
    this.initRecipe();
  }

  ngOnInit(): void {}

  async exit() {
    await this.routerService.goToRecipes();
  }

  addRecipe(): void {
    this.loaderService.isLoading.next(true);
    const recipe = this.formRecipe.getRecipeRequest();
    this.recipesService
      .createRecipe(recipe)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Receta creada con éxito');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        },
      });
  }

  editRecipe(): void {
    this.loaderService.isLoading.next(true);
    const recipe = this.formRecipe.getRecipeRequest(true);
    this.recipesService
      .updateRecipe(this.recipe!._id, recipe)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Receta editada con éxito');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        },
      });
  }

  private initRecipe() {
    this.activatedRoute.data.subscribe((data) => {
      this.recipe = data.recipe;
      this.edit = !!this.recipe;
    });
  }
}
