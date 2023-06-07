import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeRequestModel } from '@core/models/employee-request.model';
import { EmployeeModel } from '@core/models/employee.model';
import { EmployeesService } from '@core/services/employees.service';
import { LoaderService } from '@core/services/loader.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-employee-page',
  templateUrl: './add-employee-page.component.html',
  styleUrls: ['./add-employee-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddEmployeePageComponent implements OnInit {
  form!: FormGroup;
  edit = false;
  employee: EmployeeModel | null = null;

  buttonClear = {
    name: false,
    surname: false,
    email: false,
    phone: false,
  };

  imageFile?: string = '';
  selectedFile?: File;
  removeProfileImage = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly employeesService: EmployeesService,
    private readonly optionalPipe: OptionalPipe,
    private readonly loaderService: LoaderService,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.employeesService
        .getEmployee(params['id'])
        .pipe(
          finalize(() => {
            this.loaderService.isLoading.next(false);
          })
        )
        .subscribe(
          (res) => {
            this.edit = true;
            this.employee = res;
            this.initForm();
          },
          (err) => {
            this.exit();
            this.snackerService.showError('Algo no ha sucedido como se esperaba');
          }
        );
    } else {
      this.initForm();
      this.loaderService.isLoading.next(false);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [this.edit ? this.employee!.name : null, [Validators.required]],
      surname: [this.edit ? this.employee!.surname : null],
      email: [this.edit ? this.employee!.email : null, [Validators.required, Validators.email]],
      phone: [this.edit ? this.employee!.phone : null],
      admin: [this.edit ? this.employee!.admin : false],
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

  get admin(): boolean {
    return this.form.value.admin;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  exit(): void {
    this.routerService.goToEmployees();
  }

  addEmployee(): void {
    this.loaderService.isLoading.next(true);
    const employee = this.getEmployeeRequest();
    this.employeesService
      .createEmployee(employee)
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
            this.employeesService.uploadProfileImage(res._id, fd).subscribe(
              (res) => {
                this.exit();
                this.snackerService.showSuccessful('Profesional creado con éxito');
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Error al subir la foto de perfil');
              }
            );
          } else {
            this.exit();
            this.snackerService.showSuccessful('Profesional creado con éxito');
          }
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  editEmployee(): void {
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
          if (this.selectedFile) {
            const fd = new FormData();
            fd.append('file', this.selectedFile!, this.selectedFile?.name);
            this.employeesService.uploadProfileImage(res._id, fd).subscribe(
              (res) => {
                this.exit();
                this.snackerService.showSuccessful('Profesional editado con éxito');
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Error al subir la foto la foto de perfil');
              }
            );
          } else if (this.removeProfileImage) {
            this.employeesService.removeProfileImage(res._id).subscribe(
              (res) => {
                this.exit();
                this.snackerService.showSuccessful('Profesional editado con éxito');
              },
              (err) => {
                console.log(err);
                this.exit();
                this.snackerService.showError('Error al eliminar la foto de perfil');
              }
            );
          } else {
            this.exit();
            this.snackerService.showSuccessful('Profesional editado con éxito');
          }
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  private getEmployeeRequest(edit = false): EmployeeRequestModel {
    const request = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      phone: this.phone,
      admin: this.admin,
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
    this.imageFile = '';
  }

  onRecoverProfileImage(): void {
    this.removeProfileImage = false;
    this.selectedFile = undefined;
    this.imageFile = '';
  }
}
