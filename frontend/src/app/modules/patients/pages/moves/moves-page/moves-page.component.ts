import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DateRange } from '@core/interfaces/date-range';
import { ConsultModel } from '@core/models/consult/consult.model';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { MoveModel } from '@core/models/move/move.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { ConsultsService } from '@core/services/api/consults.service';
import { MovesService } from '@core/services/api/moves.service';
import { PatientsService } from '@core/services/api/patients.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { StorageService } from '@core/services/storage.service';
import { addDay, getDateRange, getDay } from '@core/utils/date-utils';
import { ImportWeekRoutineDialogComponent } from '@modules/week-routines/dialogs/import-week-routine-dialog/import-week-routine-dialog.component';
import { daysInit } from '@shared/components/weekly-calendar/constant/days-init';
import { WeeklyCalendarType } from '@shared/components/weekly-calendar/enums/weekly-calendar-type';
import { Day } from '@shared/components/weekly-calendar/interfaces/day';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-moves-page',
  templateUrl: './moves-page.component.html',
  styleUrls: ['./moves-page.component.css'],
})
export class MovesPageComponent implements OnInit {
  days: Day[] = daysInit;
  weeklyCalendarType = WeeklyCalendarType;
  employee!: EmployeeModel;
  patient!: PatientModel;
  consult!: ConsultModel;
  dateRange: DateRange = getDateRange(new Date());

  constructor(
    private readonly patientsService: PatientsService,
    private readonly consultsService: ConsultsService,
    private readonly movesService: MovesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly storageService: StorageService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['date']) this.dateRange = getDateRange(new Date(params['date']));
    this.initPatient();
    this.initEmployee();
    this.loadMoves();
    this.initLastConsult();
  }

  changeDateRange(nWeeks: number): void {
    const date = addDay(this.dateRange.startDate!, 7 * nWeeks);
    this.dateRange = getDateRange(date);
    this.loadMoves();
  }

  loadMoves(): void {
    this.loaderService.isLoading.next(true);
    this.movesService
      .getMoves(this.patient!._id, this.dateRange)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.days.forEach((_, i) => {
            this.days[i].items = res.filter((moveItem) => {
              return getDay(moveItem.date) - 1 == i;
            });
            this.days[i].date = addDay(this.dateRange.startDate!, i);
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addMove(date: Date): void {
    this.routerService.goToAddMove(this.patient._id, date);
  }

  editMove(move: MoveModel): void {
    this.routerService.goToEditMove(this.patient._id, move._id);
  }

  deleteMove(move: MoveModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar ejercicio', 'Seguro que quieres eliminar el ejercicio?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.movesService
            .removeMove(move._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: (res) => {
                this.snackerService.showSuccessful('Ejercicio eliminada con éxito');
                this.loadMoves();
              },
              error: (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              },
            });
        }
      });
  }

  importWeekRoutine() {
    const dialogRef = this.dialog.open(ImportWeekRoutineDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe({
      next: (weekRoutine: WeekRoutineModel) => {
        if (weekRoutine) {
          this.clearMoves();
          this.loadMoves();
        }
      },
    });
  }

  private clearMoves() {
    this.loaderService.isLoading.next(true);
    this.movesService
      .clearMoves(this.patient._id, this.dateRange)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe();
  }

  private initPatient() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.patient = data.patient;
      },
    });
  }

  private initEmployee() {
    this.employee = this.storageService.getUser();
  }

  private initLastConsult() {
    this.consultsService.getLastConsult(this.patient._id, this.employee._id).subscribe({
      next: (res) => {
        this.consult = res;
      },
    });
  }
}
