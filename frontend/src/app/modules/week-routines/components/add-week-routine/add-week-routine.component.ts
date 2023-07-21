import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DietRequest } from '@core/models/diet/diet-request.model';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { RouterService } from '@core/services/router.service';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-week-routine',
  templateUrl: './add-week-routine.component.html',
  styleUrls: ['./add-week-routine.component.css'],
})
export class AddWeekRoutineComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<AddWeekRoutineComponent>,
    private readonly fb: FormBuilder,
    private readonly optionalPipe: OptionalPipe,
    private readonly weekRoutinesService: WeekRoutinesService,
    private readonly loaderService: LoaderService,
    private readonly routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      description: [null],
    });
  }

  get title(): string | null {
    return this.form.value.title;
  }

  get description(): string | null {
    return this.form.value.description;
  }

  addWeekRoutine(): void {
    const weekRoutine = this.getWeekRoutineRequest();
    this.loaderService.isLoading.next(true);
    this.weekRoutinesService
      .create(weekRoutine)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async (res) => {
          await this.routerService.goToEditWeekRoutine(res._id);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getWeekRoutineRequest(): DietRequest {
    const request = {
      title: this.title,
      description: this.description,
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    return this.optionalPipe.transform(request);
  }
}
