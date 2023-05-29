import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRequestModel } from '@core/models/auth-request.model';
import { AuthService } from '@core/services/auth.service';
import { EmployeesService } from '@core/services/employees.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly employeesService: EmployeesService
  ) {}

  get email(): string {
    return this.form.value.email;
  }

  get password(): string {
    return this.form.value.password;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.loading = true;
    const user: AuthRequestModel = this.getAuthRequest();
    this.authService
      .getNewToken(user)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => {
          this.loading = true;
          this.authService.login(res);
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  private getAuthRequest(): AuthRequestModel {
    return {
      email: this.email,
      password: this.password,
    };
  }

  forgotPassword(): void {
    this.routerService.goToForgotPassword();
  }
}
