import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '@core/enums/dish';
import { Meal } from '@core/enums/meal';
import { AttachmentModel } from '@core/models/attachment.model';
import { RecipeRequestModel } from '@core/models/recipe-request.model';
import { RecipeModel } from '@core/models/recipe.model';
import { AttachmentsService } from '@core/services/attachments.service';
import { LoaderService } from '@core/services/loader.service';
import { RecipesService } from '@core/services/recipes.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { IngredientStructure } from '@shared/components/ingredients-input/interfaces/ingredient-structure';
import { LinkStructure } from '@shared/components/links-input/interfaces/link-structure';
import { VideoStructure } from '@shared/components/videos-input/interfaces/video-structure';
import { finalize } from 'rxjs/operators';
import { OptionalPipe } from '../../../../shared/pipes/optional.pipe';

@Component({
  selector: 'app-add-recipe-page',
  templateUrl: './add-recipe-page.component.html',
  styleUrls: ['./add-recipe-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddRecipePageComponent implements OnInit {
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
    private readonly recipesService: RecipesService,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly fb: FormBuilder,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.recipesService
        .getRecipe(params['id'])
        .pipe(
          finalize(() => {
            this.loaderService.isLoading.next(false);
          })
        )
        .subscribe(
          (res) => {
            this.edit = true;
            this.recipe = res;
            this.initForm();
          },
          (err) => {
            this.exit();
            this.snackerService.showError('Algo no ha sucedido como se esperaba');
          }
        );
    } else {
      this.initForm();
      this.loaderService.isLoading.next(false);
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
    this.routerService.goToRecipes();
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
    const recipe = this.getRecipeRequest();
    console.log(recipe);
    this.recipesService
      .createRecipe(recipe)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Receta creada con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  editRecipe(): void {
    this.loaderService.isLoading.next(true);
    const recipe = this.getRecipeRequest(true);
    this.recipesService
      .updateRecipe(this.recipe!._id, recipe)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Receta editada con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
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
}
