import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConsultModel } from '@core/models/consult.model';
import { PatientModel } from '@core/models/patient.model';
import { ConsultsService } from '@core/services/consults.service';
import { LoaderService } from '@core/services/loader.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { getDateUTC } from '@core/utils/date-utils';
import { finalize } from 'rxjs/operators';
import { ConsultRequestModel } from '../../../../core/models/consult-request.model';
import { ViewPatientService } from '../../../../core/services/view-patient.service';
import { OptionalPipe } from '../../../../shared/pipes/optional.pipe';

@Component({
  selector: 'app-add-consult-page',
  templateUrl: './add-consult-page.component.html',
  styleUrls: ['./add-consult-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddConsultPageComponent implements OnInit {
  form!: FormGroup;
  edit = false;
  patient: PatientModel | null = null;
  consult: ConsultModel | null = null;

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
    private readonly snackerService: SnackerService,
    private readonly viewPatientService: ViewPatientService
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.viewPatientService.patient$.subscribe(
      (res) => {
        this.patient = res;
        if (params['idcon']) {
          this.loaderService.isLoading.next(true);
          this.consultsService
            .getConsult(params['idcon'])
            .pipe(finalize(() => this.loaderService.isLoading.next(false)))
            .subscribe(
              (res) => {
                this.edit = true;
                this.consult = res;
                this.initForm();
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Algo no ha sucedido como se esperaba');
              }
            );
        } else {
          this.initForm();
        }
      },
      (err) => {
        console.log(err);
        this.routerService.goToPatients();
        this.snackerService.showError('No se ha encontrado al paciente');
      }
    );
  }

  initForm(): void {
    this.form = this.fb.group({
      masa: [
        this.edit ? (this.consult!.masa != undefined ? this.consult!.masa : null) : null,
        [Validators.min(0)],
      ],
      imc: [
        this.edit ? (this.consult!.imc != undefined ? this.consult!.imc : null) : null,
        [Validators.min(0)],
      ],
      per_abdominal: [
        this.edit
          ? this.consult!.per_abdominal != undefined
            ? this.consult!.per_abdominal
            : null
          : null,
        [Validators.min(0)],
      ],
      tension: [
        this.edit ? (this.consult!.tension != undefined ? this.consult!.tension : null) : null,
        [Validators.min(0)],
      ],
      trigliceridos: [
        this.edit
          ? this.consult!.trigliceridos != undefined
            ? this.consult!.trigliceridos
            : null
          : null,
        [Validators.min(0)],
      ],
      hdl: [
        this.edit ? (this.consult!.hdl != undefined ? this.consult!.hdl : null) : null,
        [Validators.min(0)],
      ],
      ldl: [
        this.edit ? (this.consult!.ldl != undefined ? this.consult!.ldl : null) : null,
        [Validators.min(0)],
      ],
      hemoglobina: [
        this.edit
          ? this.consult!.hemoglobina != undefined
            ? this.consult!.hemoglobina
            : null
          : null,
        [Validators.min(0)],
      ],
      glucosa: [
        this.edit ? (this.consult!.glucosa != undefined ? this.consult!.glucosa : null) : null,
        [Validators.min(0)],
      ],
      comments: [
        this.edit ? (this.consult!.comments != undefined ? this.consult!.comments : null) : null,
      ],
    });
    if (this.edit) this.created_at = this.consult!.created_at;
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

  exit(): void {
    this.routerService.goToConsults();
  }

  addConsult(): void {
    const consult = this.getConsultRequest();
    this.loaderService.isLoading.next(true);
    this.consultsService
      .createConsult(consult)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Consulta creada con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  editConsult(): void {
    const consult = this.getConsultRequest(true);
    this.loaderService.isLoading.next(true);
    this.consultsService
      .updateConsult(this.consult!._id, consult)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Consulta edita con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
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
}
