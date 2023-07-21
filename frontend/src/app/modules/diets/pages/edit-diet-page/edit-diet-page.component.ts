import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { DietModel } from '@core/models/diet/diet';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { DietsService } from '@core/services/api/diets.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
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
  diet!: DietModel;

  constructor(
    private readonly dietsService: DietsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initDiet();
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
    const dialogRef = this.matDialog.open(ImportDialogComponent, {
      width: '800px',
      data: ImportType.Recipe,
    });
    dialogRef.afterClosed().subscribe({
      next: (res: RecipeModel | string) => {
        if (res === 'CUSTOM') {
          this.routerService.goToAddRecipeForDiet(this.diet._id, day.day);
        } else {
          this.importRecipe(res as RecipeModel, day);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  importRecipe(recipe: RecipeModel, day: Day) {
    this.dietsService.addRecipe(this.diet._id, day.day, recipe).subscribe({
      next: () => {
        this.snackerService.showSuccessful('Receta importada con éxito');
        this.refreshUI();
      },
      error: () => {
        this.snackerService.showError('No se ha podido importar la receta');
      },
    });
  }

  editRecipe(day: Day, recipe: RecipeModel): void {
    this.routerService.goToEditRecipeForDiet(this.diet._id, day.day, recipe._id);
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
            .subscribe({
              next: (res) => {
                this.snackerService.showSuccessful('Receta eliminada con éxito');
                this.diet = res;
                this.initDays();
              },
              error: (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              },
            });
        }
      });
  }

  private initDiet() {
    this.activatedRoute.data.subscribe((data) => {
      this.diet = data.diet;
      this.initDays();
    });
  }

  private refreshUI() {
    this.dietsService.getDiet(this.diet!._id).subscribe({
      next: (diet: DietModel) => {
        this.diet = diet;
        this.initDays();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
