import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '@core/enums/dish';
import { Meal } from '@core/enums/meal';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { IngredientModel } from '@core/models/ingredient/ingredient.model';
import { RecipeRequestModel } from '@core/models/recipe/recipe-request.model';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { RecipesService } from '@core/services/api/recipes.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
import { IngredientStructure } from '@shared/components/ingredients-input/interfaces/ingredient-structure';
import { LinkStructure } from '@shared/components/links-input/interfaces/link-structure';
import { VideoStructure } from '@shared/components/videos-input/interfaces/video-structure';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form-recipe',
  templateUrl: './form-recipe.component.html',
  styleUrls: ['./form-recipe.component.css', '../../../../../assets/styles/form.css'],
})
export class FormRecipeComponent implements OnInit {
  @Input() recipe!: RecipeModel;
  @Input() edit = false;
  @Input() showImportRecipe = false;

  form!: FormGroup;
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
    private readonly attachmentsService: AttachmentsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly recipesService: RecipesService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly optionalPipe: OptionalPipe,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
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
        this.recipe!.links.map((url: string, id: number) => {
          return { id, url };
        }) || [];
      this.videos =
        this.recipe!.videos.map((url: string, id: number) => {
          return { id, url };
        }) || [];
      this.ingredients =
        this.recipe!.ingredients.map((ingredient: IngredientModel, id: number) => {
          return { id, ingredient };
        }) || [];
      if (this.recipe?.attachment) {
        this.loaderService.isLoading.next(true);
        this.attachmentsService
          .getAttachment(this.recipe.attachment)
          .pipe(finalize(() => this.loaderService.isLoading.next(false)))
          .subscribe({
            next: (res) => {
              this.attachment = res;
            },
            error: (err) => {
              this.attachment = null;
              console.log(err);
            },
          });
      } else {
        this.attachment = null;
      }
    }
  }

  get title(): AbstractControl {
    return this.form.get('title') as AbstractControl;
  }

  get description(): AbstractControl {
    return this.form.get('description') as AbstractControl;
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

  getRecipeRequest(edit = false): RecipeRequestModel {
    const request = {
      title: this.title.value,
      description: this.description.value,
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
              .subscribe({
                next: (res) => {
                  this.attachment = res;
                },
                error: (err) => {
                  this.attachment = null;
                  console.log(err);
                },
              });
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
