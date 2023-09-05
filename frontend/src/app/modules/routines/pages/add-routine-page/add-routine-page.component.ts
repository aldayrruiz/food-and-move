import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoutineModel } from '@core/models/routine/routine.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { RoutinesService } from '@core/services/api/routines.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { FormRoutineComponent } from '@modules/routines/components/form-routine/form-routine.component';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-routine-page',
  templateUrl: './add-routine-page.component.html',
  styleUrls: ['./add-routine-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddRoutinePageComponent implements OnInit {
  @ViewChild('formRoutine') formRoutine!: FormRoutineComponent;
  routine!: RoutineModel;
  edit = false;

  buttonClear = {
    title: false,
    description: false,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly routinesService: RoutinesService,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService
  ) {}

  ngOnInit() {
    this.initRoutine();
  }

  async exit() {
    await this.routerService.goToRoutines();
  }

  addRoutine(): void {
    this.loaderService.isLoading.next(true);
    const routine = this.formRoutine.getRoutineRequest();
    this.routinesService
      .createRoutine(routine)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Ejercicio añadida con éxito');
          await this.routerService.goToRoutines();
        },
        error: (err) => {
          this.snackerService.showError(err.error.message);
        },
      });
  }

  async editRoutine() {
    this.loaderService.isLoading.next(true);
    const routine = this.formRoutine.getRoutineRequest();
    this.routinesService
      .updateRoutine(this.routine._id, routine)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Ejercicio editada con éxito');
          await this.routerService.goToRoutines();
        },
        error: (err) => {
          this.snackerService.showError(err.error.message);
        },
      });
  }

  private initRoutine() {
    this.activatedRoute.data.subscribe((data) => {
      this.routine = data.routine;
      this.edit = !!this.routine;
      console.log(this.routine, this.edit);
    });
  }
}
