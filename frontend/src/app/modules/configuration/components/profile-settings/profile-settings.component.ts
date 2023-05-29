import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeRequestModel } from '@core/models/employee-request.model';
import { EmployeeModel } from '@core/models/employee.model';
import { AuthService } from '@core/services/auth.service';
import { EmployeesService } from '@core/services/employees.service';
import { LoaderService } from '@core/services/loader.service';
import { SnackerService } from '@core/services/snacker.service';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css', '../../../../../assets/styles/form.css'],
})
export class ProfileSettingsComponent implements OnInit {
  @Input() employee: EmployeeModel | null = null;
  @Output() setEmployee = new EventEmitter<EmployeeModel | null>();

  form!: FormGroup;

  buttonClear = {
    name: false,
    surname: false,
    email: false,
    phone: false,
  };

  imageFile?: string = '';
  selectedFile?: File;
  removeProfileImage: boolean = false;

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly optionalPipe: OptionalPipe
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [this.employee!.name, [Validators.required]],
      surname: [this.employee!.surname],
      email: [this.employee!.email, [Validators.required, Validators.email]],
      phone: [this.employee!.phone],
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

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
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
    this.imageFile = '';
  }

  onRecoverProfileImage(): void {
    this.removeProfileImage = false;
    this.selectedFile = undefined;
    this.imageFile = '';
  }

  resetProfile(): void {
    this.initForm();
    this.onRecoverProfileImage();
  }

  editProfile(): void {
    this.loaderService.isLoading.next(true);
    const employee = this.getEmployeeRequest(true);
    this.employeesService
      .updateEmployee(this.employee!._id, employee)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          this.employee = res;
          this.setEmployee.emit(res);
          if (this.selectedFile) {
            const fd = new FormData();
            fd.append('file', this.selectedFile!, this.selectedFile?.name);
            this.employeesService.uploadProfileImage(res._id, fd).subscribe(
              (res) => {
                this.snackerService.showSuccessful('Perfil editado con éxito');
                this.authService.refreshUser();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError('Error al subir la foto la foto de perfil');
              }
            );
          } else if (this.removeProfileImage) {
            this.employeesService.removeProfileImage(res._id).subscribe(
              (res) => {
                this.snackerService.showSuccessful('Perfil editado con éxito');
                this.authService.refreshUser();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError('Error al eliminar la foto de perfil');
              }
            );
          } else {
            this.snackerService.showSuccessful('Perfil editado con éxito');
            this.authService.refreshUser();
          }
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  private getEmployeeRequest(edit: boolean = false): EmployeeRequestModel {
    const request = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: '123456789',
      phone: this.phone,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }
}
