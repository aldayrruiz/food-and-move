import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { RoutineModel } from '@core/models/routine/routine.model';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
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
    private readonly dialogService: DialogService,
    private readonly dialog: MatDialog
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

  async exit() {
    await this.routerService.goToDiet();
  }

  async addRoutine(day: Day) {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: { type: ImportType.Routine, showCustom: true },
    });

    dialogRef.afterClosed().subscribe({
      next: async (res: RoutineModel | string) => {
        if (res === 'CUSTOM') {
          await this.routerService.goToAddRoutineForWeekRoutine(this.weekRoutine._id, day.day);
          return;
        }
        if (res) {
          this.importRoutine(res as RoutineModel, day);
        }
      },
      error: (err) => {
        console.log(err);
        this.snackerService.showError(err.error.message);
      },
    });
  }

  importRoutine(routine: RoutineModel, day: Day) {
    this.weekRoutinesService.addRoutine(this.weekRoutine._id, day.day, routine).subscribe({
      next: (res) => {
        this.snackerService.showSuccessful('Ejercicio importada con éxito');
        this.refreshUI();
      },
      error: (err) => {
        console.log(err);
        this.snackerService.showError(err.error.message);
      },
    });
  }

  async editRoutine(day: Day, routine: RoutineModel) {
    await this.routerService.goToEditRoutineForWeekRoutine(this.weekRoutine._id, day.day, routine._id);
  }

  deleteRoutine(day: Day, routine: RoutineModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar rutina', 'Seguro que quieres eliminar ' + routine.title + '?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.weekRoutinesService
            .removeRoutine(this.weekRoutine!._id, day.day, routine._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: (res) => {
                this.snackerService.showSuccessful('Ejercicio eliminada con éxito');
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

  private refreshUI() {
    this.weekRoutinesService.getById(this.weekRoutine._id).subscribe({
      next: (weekRoutine) => {
        this.weekRoutine = weekRoutine;
        this.initDays();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
