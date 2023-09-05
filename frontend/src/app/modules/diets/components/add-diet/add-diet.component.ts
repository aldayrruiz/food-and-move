import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DietRequest } from '@core/models/diet/diet-request.model';
import { DietsService } from '@core/services/api/diets.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { RouterService } from '@core/services/router.service';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-diet',
  templateUrl: './add-diet.component.html',
  styleUrls: ['./add-diet.component.css'],
})
export class AddDietComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<AddDietComponent>,
    private readonly fb: FormBuilder,
    private readonly optionalPipe: OptionalPipe,
    private readonly dietsService: DietsService,
    private readonly loaderService: LoaderService,
    private readonly routerService: RouterService,
    private readonly titleCasePipe: TitleCasePipe
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

  addDiet(): void {
    const diet = this.getDietRequest();
    this.loaderService.isLoading.next(true);
    this.dietsService
      .createDiet(diet)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.routerService.goToEditDiet(res._id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getDietRequest(): DietRequest {
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

  changeToTitleCase(event: any) {
    event.target.value = this.titleCasePipe.transform(event.target.value);
  }
}
