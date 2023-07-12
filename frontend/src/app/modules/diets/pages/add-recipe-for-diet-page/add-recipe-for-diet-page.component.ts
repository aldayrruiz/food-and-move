import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { Dish } from '@core/enums/dish';
import { Meal } from '@core/enums/meal';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { DietModel } from '@core/models/diet/diet';
import { RecipeRequestModel } from '@core/models/recipe/recipe-request.model';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { AttachmentsService } from '@core/services/attachments.service';
import { DietsService } from '@core/services/diets.service';
import { LoaderService } from '@core/services/loader.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
import { IngredientStructure } from '@shared/components/ingredients-input/interfaces/ingredient-structure';
import { LinkStructure } from '@shared/components/links-input/interfaces/link-structure';
import { VideoStructure } from '@shared/components/videos-input/interfaces/video-structure';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-recipe-for-diet-page',
  templateUrl: './add-recipe-for-diet-page.component.html',
  styleUrls: ['./add-recipe-for-diet-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddRecipeForDietPageComponent implements OnInit {
  diet: DietModel | null = null;
  day: DayOfWeek | null = null;

  form!: FormGroup;
  edit = false;
  recipe: RecipeModel | null = null;

  links: Array<LinkStructure> = [];
  videos: Array<VideoStructure> = [];
  ingredients: Array<IngredientStructure> = [];
  attachment: AttachmentModel | null = null;

  availableMeal = [Meal.Desayuno, Meal.Almuerzo, Meal.Merienda, Meal.Cena];
  availableDish = [Dish.Primero, Dish.Segundo, Dish.Postre];
  meal: Meal = Meal.Almuerzo;
  dish: Dish = Dish.Primero;

  buttonClear = {
    title: false,
    description: false,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dietsService: DietsService,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly fb: FormBuilder,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['dietId']) {
      this.loaderService.isLoading.next(true);
      this.dietsService
        .getDiet(params['dietId'])
        .pipe(finalize(() => this.loaderService.isLoading.next(false)))
        .subscribe(
          (res) => {
            this.diet = res;
            this.day = params['day'];
            console.log(this.day);
            if (params['recipeId']) {
              this.edit = true;
              this.loaderService.isLoading.next(true);
              this.dietsService
                .getRecipe(this.diet!._id, this.day!, params['recipeId'])
                .pipe(finalize(() => this.loaderService.isLoading.next(false)))
                .subscribe(
                  (res) => {
                    this.recipe = res;
                    this.initForm();
                  },
                  (err) => {
                    console.log(err);
                    this.exit();
                    this.snackerService.showError('No se ha encontrado la receta');
                  }
                );
            } else {
              this.edit = false;
              this.initForm();
            }
          },
          (err) => {
            console.log(err);
            this.exit();
            this.snackerService.showError('No se ha encontrado la dieta');
          }
        );
    } else {
      this.exit();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [this.edit ? this.recipe!.title : null, [Validators.required]],
      description: [this.edit ? this.recipe!.description : null],
    });
    if (this.edit) {
      this.meal = this.recipe!.meal;
      this.changeMeal();
      this.dish = this.recipe!.dish;
      this.links =
        this.recipe!.links.map((url, id) => {
          return { id, url };
        }) || [];
      this.videos =
        this.recipe!.videos.map((url, id) => {
          return { id, url };
        }) || [];
      this.ingredients =
        this.recipe!.ingredients.map((ingredient, id) => {
          return { id, ingredient };
        }) || [];
      if (this.recipe?.attachment) {
        this.loaderService.isLoading.next(true);
        this.attachmentsService
          .getAttachment(this.recipe.attachment)
          .pipe(finalize(() => this.loaderService.isLoading.next(false)))
          .subscribe(
            (res) => {
              this.attachment = res;
            },
            (err) => {
              this.attachment = null;
              console.log(err);
            }
          );
      } else {
        this.attachment = null;
      }
    }
  }

  get title(): string | null {
    return this.form.value.title;
  }

  get description(): string | null {
    return this.form.value.description;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  exit(): void {
    this.routerService.goToEditDiet(this.diet?._id || 'noid');
  }

  changeMeal(): void {
    switch (this.meal) {
      case Meal.Desayuno:
        this.availableDish = [Dish.Principal];
        this.dish = Dish.Principal;
        break;
      case Meal.Almuerzo:
        this.availableDish = [Dish.Primero, Dish.Segundo, Dish.Postre];
        this.dish = Dish.Primero;
        break;
      case Meal.Merienda:
        this.availableDish = [Dish.Principal];
        this.dish = Dish.Principal;
        break;
      case Meal.Cena:
        this.availableDish = [Dish.Principal, Dish.Postre];
        this.dish = Dish.Principal;
        break;
      default:
        break;
    }
  }

  addRecipe(): void {
    this.loaderService.isLoading.next(true);
    const recipe = this.getRecipeRequest(false);
    this.dietsService
      .addRecipe(this.diet!._id, this.day!, recipe)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Receta agregada con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error);
        }
      );
  }

  editRecipe(): void {
    this.loaderService.isLoading.next(true);
    const recipe = this.getRecipeRequest(true);
    this.dietsService
      .updateRecipe(this.diet!._id, this.day!, this.recipe!._id, recipe)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Receta editada con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error);
        }
      );
  }

  getRecipeRequest(edit = false): RecipeRequestModel {
    const request = {
      title: this.title,
      description: this.description,
      meal: this.meal,
      dish: this.dish,
      links: this.links.map((link) => link.url),
      videos: this.videos.map((video) => video.url),
      ingredients: this.ingredients.map((ingredient) => ingredient.ingredient),
      attachment: this.attachment ? this.attachment._id : null,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }

  importRecipe(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: ImportType.Recipe,
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          const recipe = res as RecipeModel;
          this.form.setValue({
            title: recipe.title,
            description: recipe.description ? recipe.description : '',
          });
          this.meal = recipe.meal;
          this.changeMeal();
          this.dish = recipe.dish;
          this.links =
            recipe.links.map((url, id) => {
              return { id, url };
            }) || [];
          this.videos =
            recipe.videos.map((url, id) => {
              return { id, url };
            }) || [];
          this.ingredients =
            recipe.ingredients.map((ingredient, id) => {
              return { id, ingredient };
            }) || [];
          if (recipe.attachment) {
            this.loaderService.isLoading.next(true);
            this.attachmentsService
              .getAttachment(recipe.attachment)
              .pipe(finalize(() => this.loaderService.isLoading.next(false)))
              .subscribe(
                (res) => {
                  this.attachment = res;
                },
                (err) => {
                  this.attachment = null;
                  console.log(err);
                }
              );
          } else {
            this.attachment = null;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
