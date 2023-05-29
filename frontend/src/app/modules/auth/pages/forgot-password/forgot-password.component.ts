import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly routerService: RouterService,
    private readonly authService: AuthService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email(): string {
    return this.form.value.email;
  }

  forgotPassword(): void {
    this.loading = true;
    this.authService
      .forgotPassword(this.email)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => {
          this.snackerService.showSuccessful('Email enviado');
          this.exit();
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  exit(): void {
    this.routerService.goToLogin();
  }
}
