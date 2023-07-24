import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '@core/enums/dish';
import { Meal } from '@core/enums/meal';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { FoodRequestModel } from '@core/models/food/food-request.model';
import { FoodModel } from '@core/models/food/food.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { FoodsService } from '@core/services/api/foods.service';
import { PatientsService } from '@core/services/api/patients.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { getDateUTC } from '@core/utils/date-utils';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
import { IngredientStructure } from '@shared/components/ingredients-input/interfaces/ingredient-structure';
import { LinkStructure } from '@shared/components/links-input/interfaces/link-structure';
import { VideoStructure } from '@shared/components/videos-input/interfaces/video-structure';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-food-page',
  templateUrl: './add-food-page.component.html',
  styleUrls: ['./add-food-page.component.css', '../../../../../../assets/styles/form.css'],
})
export class AddFoodPageComponent implements OnInit {
  patient!: PatientModel;

  date: Date = new Date();

  form!: FormGroup;
  edit = false;
  food!: FoodModel;

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
    comments: false,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly patientsService: PatientsService,
    private readonly foodsService: FoodsService,
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
    this.initPatient();
    this.initDate();
    this.initFood();
    this.initForm();
    this.loaderService.isLoading.next(false);
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [this.edit ? this.food?.title : null, [Validators.required]],
      description: [this.edit ? this.food?.description : null],
      comments: [this.edit ? this.food?.comments : null],
    });
    if (this.edit) {
      this.meal = this.food?.meal || Meal.Almuerzo;
      this.changeMeal();
      this.dish = this.food?.dish || Dish.Primero;
      this.links =
        this.food?.links.map((url, id) => {
          return { id, url };
        }) || [];
      this.videos =
        this.food?.videos.map((url, id) => {
          return { id, url };
        }) || [];
      this.ingredients =
        this.food?.ingredients.map((ingredient, id) => {
          return { id, ingredient };
        }) || [];
      if (this.food?.attachment) {
        this.loaderService.isLoading.next(true);
        this.attachmentsService
          .getAttachment(this.food.attachment)
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

  get title(): string | null {
    return this.form.value.title;
  }

  get description(): string | null {
    return this.form.value.description;
  }

  get comments(): string | null {
    return this.form.value.comments;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  async exit() {
    await this.routerService.goToFoods(this.patient._id, this.date);
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

  importRecipe(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: { type: ImportType.Recipe, showCustom: true },
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        const recipe = res as RecipeModel;
        this.form.setValue({
          title: recipe.title,
          description: recipe.description ? recipe.description : '',
          comments: this.comments,
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addFood(): void {
    this.loaderService.isLoading.next(true);
    const foodRequest = this.getFoodRequest();
    console.log(foodRequest);
    this.foodsService
      .createFood(foodRequest)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Comida creada con éxito');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        },
      });
  }

  editFood(): void {
    this.loaderService.isLoading.next(true);
    const food = this.getFoodRequest(true);
    this.foodsService
      .updateFood(this.food._id, food)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Comida editada con éxito');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.err.message);
        },
      });
  }

  getFoodRequest(edit = false): FoodRequestModel {
    const request = {
      patient: this.patient?._id,
      date: this.date,
      title: this.title,
      description: this.description,
      comments: this.comments,
      meal: this.meal,
      dish: this.dish,
      links: this.links.map((link) => link.url),
      videos: this.videos.map((video) => video.url),
      ingredients: this.ingredients.map((ingredient) => ingredient.ingredient),
      attachment: this.attachment ? this.attachment._id : null,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }

  private initPatient(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.patient = data['patient'];
    });
  }

  private initDate(): void {
    const date = this.activatedRoute.snapshot.params['date'];
    if (date) {
      this.date = getDateUTC(new Date(date));
    }
  }

  private initFood(): void {
    const foodId = this.activatedRoute.snapshot.params['foodId'];
    if (!foodId) {
      return;
    }
    this.edit = true;
    this.foodsService.getFood(foodId).subscribe((res) => {
      this.food = res;
      this.date = res.date;
    });
  }
}
