import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeModel } from '@core/models/employee.model';
import { PatientRequestModel } from '@core/models/patient-request.model';
import { PatientModel } from '@core/models/patient.model';
import { AuthService } from '@core/services/auth.service';
import { LoaderService } from '@core/services/loader.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { birthDateValidator } from '@modules/patients/validators/date.validator';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { PhotoPipe } from '@shared/pipes/photo.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-patient-page',
  templateUrl: './add-patient-page.component.html',
  styleUrls: ['./add-patient-page.component.css', '../../../../../../assets/styles/form.css'],
})
export class AddPatientPageComponent implements OnInit {
  form!: FormGroup;
  edit = false;
  patient!: PatientModel;
  user!: EmployeeModel;

  buttonClear = {
    name: false,
    surname: false,
    email: false,
    phone: false,
    birth: false,
    height: false,
    password: false,
  };

  imageFile?: string = '';
  selectedFile?: File;
  removeProfileImage = false;

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private readonly fb: FormBuilder,
    private readonly patientsService: PatientsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.initPatient();
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [this.edit ? this.patient!.name : null, [Validators.required]],
      surname: [this.edit ? this.patient!.surname : null],
      email: [this.edit ? this.patient!.email : null, [Validators.email]],
      phone: [this.edit ? this.patient!.phone : null, [Validators.required]],
      birth: [
        this.edit
          ? this.patient!.birth
            ? this.datePipe.transform(this.patient!.birth, 'dd/MM/YYYY')
            : null
          : null,
        birthDateValidator(),
      ],
      height: [this.edit ? this.patient!.height : null],
      password: [this.edit ? this.patient!.password : null],
    });
  }

  get name(): string | null {
    return this.form.value.name;
  }

  get surname(): string | null {
    return this.form.value.surname;
  }

  get email(): string | null {
    return this.form.value.email;
  }

  get phone(): string | null {
    return this.form.value.phone;
  }

  get birth(): Date | null {
    const birth = this.form.value.birth;
    if (!birth) return null;
    const [day, month, year] = birth.split('/');
    const date = new Date(+year, +month - 1, +day);
    return date;
  }

  get height(): number | null {
    return this.form.value.height;
  }

  get password(): string | null {
    return this.form.value.password;
  }

  get employee(): string {
    return this.form.value.employee;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  addRandomPassword(): void {
    this.patientsService.generateRandomPassword().subscribe(
      (res) => {
        console.log(res);
        this.form.value.password = res.password;
        this.form.reset(this.form.value);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  exit(): void {
    this.routerService.goToPatients();
  }

  addPatient(): void {
    this.loaderService.isLoading.next(true);
    const patient = this.getPatientRequest();
    this.patientsService
      .createPatient(patient)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          if (this.selectedFile) {
            const fd = new FormData();
            fd.append('file', this.selectedFile!, this.selectedFile?.name);
            this.patientsService.uploadProfileImage(res._id, fd).subscribe(
              (res) => {
                this.exit();
                this.snackerService.showSuccessful('Paciente creado con éxito');
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Error al subir la foto de perfil');
              }
            );
          } else {
            this.exit();
            this.snackerService.showSuccessful('Paciente creado con éxito');
          }
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  editPatient(): void {
    this.loaderService.isLoading.next(true);
    const patient = this.getPatientRequest(true);
    this.patientsService
      .updatePatient(this.patient!._id, patient)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          if (this.selectedFile) {
            const fd = new FormData();
            fd.append('file', this.selectedFile!, this.selectedFile?.name);
            this.patientsService.uploadProfileImage(res._id, fd).subscribe(
              (res) => {
                this.exit();
                this.snackerService.showSuccessful('Paciente editado con éxito');
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Error al subir la foto la foto de perfil');
              }
            );
          } else if (this.removeProfileImage) {
            this.patientsService.removeProfileImage(res._id).subscribe(
              (res) => {
                this.exit();
                this.snackerService.showSuccessful('Paciente editado con éxito');
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Error al eliminar la foto de perfil');
              }
            );
          } else {
            this.exit();
            this.snackerService.showSuccessful('Paciente editado con éxito');
          }
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  private getPatientRequest(edit = false): PatientRequestModel {
    const request = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      phone: this.phone,
      birth: this.birth,
      height: this.height,
      employee: this.employee,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }

  onSelectFile(event: any): void {
    this.selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => (this.imageFile = reader.result as string);
    reader.readAsDataURL(this.selectedFile);
  }

  onRemoveProfileImage(): void {
    this.removeProfileImage = true;
    this.selectedFile = undefined;
  }

  onRecoverProfileImage(): void {
    this.removeProfileImage = false;
    this.selectedFile = undefined;
  }

  getImageProfile(): string {
    if (this.removeProfileImage) {
      return new PhotoPipe().transform('');
    }
    if (this.patient?.profile_image) {
      return new PhotoPipe().transform(this.patient?.profile_image || '');
    }
    if (this.imageFile) {
      return this.imageFile;
    }
    return new PhotoPipe().transform('');
  }

  private initPatient() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        if (data['patient']) {
          this.patient = data['patient'];
          this.edit = true;
        }
      },
    });
  }
}
