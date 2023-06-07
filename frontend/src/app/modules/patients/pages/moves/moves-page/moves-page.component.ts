import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateRange } from '@core/interfaces/date-range';
import { MoveModel } from '@core/models/move.model';
import { PatientModel } from '@core/models/patient.model';
import { DialogService } from '@core/services/dialog.service';
import { LoaderService } from '@core/services/loader.service';
import { MovesService } from '@core/services/moves.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { addDay, getDateRange, getDay } from '@core/utils/date-utils';
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

  patient!: PatientModel;
  dateRange: DateRange = getDateRange(new Date());

  constructor(
    private readonly patientsService: PatientsService,
    private readonly movesService: MovesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.patientsService.getPatient(this.activatedRoute.snapshot.params['patientId']).subscribe({
      next: (patient) => {
        this.patient = patient;
        const params = this.activatedRoute.snapshot.params;
        if (params['date']) this.dateRange = getDateRange(new Date(params['date']));
        this.loadMoves();
      },
    });
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
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Ejercicio eliminada con éxito');
                this.loadMoves();
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
