import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConsultRequestModel } from '@core/models/consult-request.model';
import { ConsultModel } from '@core/models/consult.model';
import { PatientModel } from '@core/models/patient.model';
import { ConsultsService } from '@core/services/consults.service';
import { LoaderService } from '@core/services/loader.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { getDateUTC } from '@core/utils/date-utils';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-consult-page',
  templateUrl: './add-consult-page.component.html',
  styleUrls: ['./add-consult-page.component.css', '../../../../../../assets/styles/form.css'],
})
export class AddConsultPageComponent implements OnInit {
  form!: FormGroup;
  edit = false;
  patient!: PatientModel;
  consult!: ConsultModel;

  created_at: Date = getDateUTC(new Date());

  buttonClear = {
    masa: false,
    imc: false,
    per_abdominal: false,
    tension: false,
    trigliceridos: false,
    hdl: false,
    ldl: false,
    hemoglobina: false,
    glucosa: false,
    comments: false,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly patientsService: PatientsService,
    private readonly consultsService: ConsultsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.initPatient();
    this.initConsult();
    this.initForm();
  }

  get masa(): number | null {
    return this.form.value.masa;
  }

  get imc(): number | null {
    return this.form.value.imc;
  }

  get per_abdominal(): number | null {
    return this.form.value.per_abdominal;
  }

  get tension(): number | null {
    return this.form.value.tension;
  }

  get trigliceridos(): number | null {
    return this.form.value.trigliceridos;
  }

  get hdl(): number | null {
    return this.form.value.hdl;
  }

  get ldl(): number | null {
    return this.form.value.ldl;
  }

  get hemoglobina(): number | null {
    return this.form.value.hemoglobina;
  }

  get glucosa(): number | null {
    return this.form.value.glucosa;
  }

  get comments(): string | null {
    return this.form.value.comments;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  async exit() {
    await this.routerService.goToConsults(this.patient?._id);
  }

  addConsult(): void {
    const consult = this.getConsultRequest();
    this.loaderService.isLoading.next(true);
    this.consultsService
      .createConsult(consult)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Consulta creada con éxito');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        },
      });
  }

  editConsult(): void {
    const consult = this.getConsultRequest(true);
    this.loaderService.isLoading.next(true);
    this.consultsService
      .updateConsult(this.consult?._id, consult)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: async () => {
          await this.exit();
          this.snackerService.showSuccessful('Consulta edita con éxito');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        },
      });
  }

  getConsultRequest(edit = false): ConsultRequestModel {
    const request = {
      patient: this.patient?._id,
      masa: this.masa,
      imc: this.imc,
      per_abdominal: this.per_abdominal,
      tension: this.tension,
      trigliceridos: this.trigliceridos,
      hdl: this.hdl,
      ldl: this.ldl,
      hemoglobina: this.hemoglobina,
      glucosa: this.glucosa,
      comments: this.comments,
      created_at: this.created_at,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }

  private initPatient() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.patient = data['patient'];
      },
    });
  }

  private initConsult() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        if (data['consult']) {
          this.edit = true;
          this.consult = data['consult'];
          this.created_at = this.consult?.created_at;
        }
      },
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      masa: [this.consult?.masa, [Validators.min(0)]],
      imc: [this.consult?.imc, [Validators.min(0)]],
      per_abdominal: [this.consult?.per_abdominal, [Validators.min(0)]],
      tension: [this.consult?.tension, [Validators.min(0)]],
      trigliceridos: [this.consult?.trigliceridos, [Validators.min(0)]],
      hdl: [this.consult?.hdl, [Validators.min(0)]],
      ldl: [this.consult?.ldl, [Validators.min(0)]],
      hemoglobina: [this.consult?.hemoglobina, [Validators.min(0)]],
      glucosa: [this.consult?.glucosa, [Validators.min(0)]],
      comments: [this.consult?.comments],
    });
  }
}
