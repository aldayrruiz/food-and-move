import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeModel } from '@core/models/employee.model';
import { AuthService } from '@core/services/auth.service';
import { EmployeesService } from '@core/services/employees.service';
import { LoaderService } from '@core/services/loader.service';
import { SnackerService } from '@core/services/snacker.service';
import { OptionalPipe } from '@shared/pipes/optional.pipe';

@Component({
  selector: 'app-change-password-settings',
  templateUrl: './change-password-settings.component.html',
  styleUrls: ['./change-password-settings.component.css', '../../../../../assets/styles/form.css'],
})
export class ChangePasswordSettingsComponent implements OnInit {
  @Input() employee: EmployeeModel | null = null;
  @Output() setEmployee = new EventEmitter<EmployeeModel | null>();

  form!: FormGroup;

  buttonClear = {
    password: false,
    newPassword: false,
    confirmation: false,
  };

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
      password: [null],
      newPassword: [null],
      confirmation: [null],
    });
  }

  get password(): string | null {
    return this.form.value.password;
  }

  get newPassword(): string | null {
    return this.form.value.newPassword;
  }

  get confirmation(): string | null {
    return this.form.value.confirmation;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  reset(): void {
    this.initForm();
  }

  changePassword(): void {
    if (this.newPassword == this.confirmation) {
      this.employeesService
        .changePassword(this.employee!._id, {
          password: this.password || '',
          newPassword: this.newPassword || '',
        })
        .subscribe(
          (res) => {
            this.authService.logout();
            this.snackerService.showSuccessful('Contraseña cambiada correctamente');
          },
          (err) => {
            console.log(err);
            this.snackerService.showError(err.error.message);
          }
        );
    } else {
      this.snackerService.showError('Las contraseñas no coinciden');
    }
  }
}
