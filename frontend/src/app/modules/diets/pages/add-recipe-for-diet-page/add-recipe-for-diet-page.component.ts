import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { DietModel } from '@core/models/diet/diet';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { DietsService } from '@core/services/api/diets.service';
import { RecipesService } from '@core/services/api/recipes.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { FormRecipeComponent } from '@modules/recipes/components/form-recipe/form-recipe.component';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-recipe-for-diet-page',
  templateUrl: './add-recipe-for-diet-page.component.html',
  styleUrls: ['./add-recipe-for-diet-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddRecipeForDietPageComponent implements OnInit {
  @ViewChild('formRecipe') formRecipe!: FormRecipeComponent;
  recipe!: RecipeModel;
  diet!: DietModel;
  day!: DayOfWeek;
  edit = false;

  buttonClear = {
    title: false,
    description: false,
  };

  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly recipesService: RecipesService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly optionalPipe: OptionalPipe,
    private readonly dietsService: DietsService
  ) {}

  ngOnInit(): void {
    this.initRecipe();
    this.initDiet();
    this.day = this.activatedRoute.snapshot.params['day'];
  }

  async exit() {
    await this.routerService.goToEditDiet(this.diet._id);
  }

  addRecipe(): void {
    this.loaderService.isLoading.next(true);
    const recipe = this.formRecipe.getRecipeRequest();
    this.dietsService
      .addRecipe(this.diet?._id, this.day, recipe)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Receta añadida con éxito');
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
    this.dietsService
      .updateRecipe(this.diet._id, this.day, this.recipe._id, recipe)
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

  private initDiet() {
    this.activatedRoute.data.subscribe((data) => {
      this.diet = data.diet;
      this.day = data.day;
    });
  }

  private initRecipe() {
    this.activatedRoute.data.subscribe((data) => {
      this.recipe = data.recipe;
      this.edit = !!this.recipe;
    });
  }
}
