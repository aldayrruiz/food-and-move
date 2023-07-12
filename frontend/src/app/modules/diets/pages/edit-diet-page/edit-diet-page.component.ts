import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { DietModel } from '@core/models/diet/diet';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { DialogService } from '@core/services/dialog.service';
import { DietsService } from '@core/services/diets.service';
import { LoaderService } from '@core/services/loader.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { daysInit } from '@shared/components/weekly-calendar/constant/days-init';
import { WeeklyCalendarType } from '@shared/components/weekly-calendar/enums/weekly-calendar-type';
import { Day } from '@shared/components/weekly-calendar/interfaces/day';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-diet-page',
  templateUrl: './edit-diet-page.component.html',
  styleUrls: ['./edit-diet-page.component.css'],
})
export class EditDietPageComponent implements OnInit {
  days: Day[] = daysInit;
  weeklyCalendarType = WeeklyCalendarType;

  diet: DietModel | null = null;

  constructor(
    private readonly dietsService: DietsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['dietId']) {
      this.loaderService.isLoading.next(true);
      this.dietsService
        .getDiet(params['dietId'])
        .pipe(
          finalize(() => {
            this.loaderService.isLoading.next(false);
          })
        )
        .subscribe(
          (res) => {
            this.diet = res;
            this.initDays();
          },
          (err) => {
            console.log(err);
            this.exit();
            this.snackerService.showError('No se ha encontrado la dieta semanal');
          }
        );
    } else {
      this.exit();
      this.snackerService.showError('No se ha encontrado la dieta semanal');
    }
  }

  initDays(): void {
    this.days = [
      {
        day: DayOfWeek.Lunes,
        items: this.diet!.monday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Martes,
        items: this.diet!.tuesday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Miercoles,
        items: this.diet!.wednesday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Jueves,
        items: this.diet!.thursday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Viernes,
        items: this.diet!.friday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Sabado,
        items: this.diet!.saturday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Domingo,
        items: this.diet!.sunday,
        date: new Date(),
      },
    ];
  }

  exit(): void {
    this.routerService.goToDiet();
  }

  addRecipe(day: Day): void {
    this.routerService.goToAddRecipeForDiet(this.diet!._id, day.day);
  }

  editRecipe(day: Day, recipe: RecipeModel): void {
    this.routerService.goToEditRecipeForDiet(this.diet!._id, day.day, recipe._id);
  }

  deleteRecipe(day: Day, recipe: RecipeModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar receta', 'Seguro que quieres eliminar ' + recipe.title + '?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.dietsService
            .removeRecipe(this.diet!._id, day.day, recipe._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Receta eliminada con éxito');
                this.diet = res;
                this.initDays();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              }
            );
        }
      });
  }
}
