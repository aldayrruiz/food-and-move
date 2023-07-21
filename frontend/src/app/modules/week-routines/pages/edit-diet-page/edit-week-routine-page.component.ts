import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { RoutineModel } from '@core/models/routine/routine.model';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { daysInit } from '@shared/components/weekly-calendar/constant/days-init';
import { WeeklyCalendarType } from '@shared/components/weekly-calendar/enums/weekly-calendar-type';
import { Day } from '@shared/components/weekly-calendar/interfaces/day';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-week-routine-page',
  templateUrl: './edit-week-routine-page.component.html',
  styleUrls: ['./edit-week-routine-page.component.css'],
})
export class EditWeekRoutinePageComponent implements OnInit {
  days: Day[] = daysInit;
  weeklyCalendarType = WeeklyCalendarType;

  weekRoutine!: WeekRoutineModel;

  constructor(
    private readonly weekRoutinesService: WeekRoutinesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initWeekRoutine();
  }

  initDays(): void {
    this.days = [
      {
        day: DayOfWeek.Lunes,
        items: this.weekRoutine.monday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Martes,
        items: this.weekRoutine!.tuesday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Miercoles,
        items: this.weekRoutine!.wednesday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Jueves,
        items: this.weekRoutine!.thursday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Viernes,
        items: this.weekRoutine!.friday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Sabado,
        items: this.weekRoutine!.saturday,
        date: new Date(),
      },
      {
        day: DayOfWeek.Domingo,
        items: this.weekRoutine!.sunday,
        date: new Date(),
      },
    ];
  }

  exit(): void {
    this.routerService.goToDiet();
  }

  addRoutine(day: Day): void {
    this.routerService.goToAddRecipeForDiet(this.weekRoutine!._id, day.day);
  }

  editRoutine(day: Day, routine: RoutineModel): void {
    this.routerService.goToEditRecipeForDiet(this.weekRoutine!._id, day.day, routine._id);
  }

  deleteRoutine(day: Day, routine: RoutineModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar rutina', 'Seguro que quieres eliminar ' + routine.title + '?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.weekRoutinesService
            .removeRecipe(this.weekRoutine!._id, day.day, routine._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: (res) => {
                this.snackerService.showSuccessful('Rutina eliminada con éxito');
                this.weekRoutine = res;
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

  private initWeekRoutine() {
    this.activatedRoute.data.subscribe((data) => {
      this.weekRoutine = data['weekRoutine'];
      this.initDays();
    });
  }
}
