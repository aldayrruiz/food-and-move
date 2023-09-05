import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';
import { RoutineModel } from '@core/models/routine/routine.model';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { RoutinesService } from '@core/services/api/routines.service';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { FormRoutineComponent } from '@modules/routines/components/form-routine/form-routine.component';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-routine-for-week-routine-page',
  templateUrl: './add-routine-for-week-routine-page.component.html',
  styleUrls: ['./add-routine-for-week-routine-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddRoutineForWeekRoutinePageComponent implements OnInit {
  @ViewChild('formRoutine') formRoutine!: FormRoutineComponent;
  routine!: RoutineModel;
  weekRoutine!: WeekRoutineModel;
  day!: DayOfWeek;
  edit = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly fb: FormBuilder,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly dialog: MatDialog,
    private readonly routinesService: RoutinesService,
    private readonly weekRoutinesService: WeekRoutinesService
  ) {}

  ngOnInit(): void {
    this.initRoutine();
    this.initWeekRoutine();
    this.day = this.activatedRoute.snapshot.params['day'];
  }

  async exit() {
    await this.routerService.goToEditWeekRoutine(this.weekRoutine._id);
  }

  addRoutine(): void {
    this.loaderService.isLoading.next(true);
    const routine = this.formRoutine.getRoutineRequest();
    this.weekRoutinesService
      .addRoutine(this.weekRoutine?._id, this.day, routine)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Ejercicio añadida con éxito');
        },
        error: (err) => {
          this.snackerService.showError(err.error.message);
        },
      });
  }

  async editRoutine() {
    const routine = this.formRoutine.getRoutineRequest();
    this.loaderService.isLoading.next(true);
    this.weekRoutinesService
      .updateRoutine(this.weekRoutine._id, this.day, this.routine._id, routine)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Ejercicio editada con éxito');
        },
        error: (err) => {
          this.snackerService.showError(err.error.message);
        },
      });
  }

  private initWeekRoutine() {
    this.activatedRoute.data.subscribe((data) => {
      this.weekRoutine = data.weekRoutine;
    });
  }

  private initRoutine() {
    this.activatedRoute.data.subscribe((data) => {
      this.routine = data.routine;
      this.edit = !!this.routine;
    });
  }
}
