import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
})
export class RecoverPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  token: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  get password(): string {
    return this.form.value.password;
  }

  get confirm(): string {
    return this.form.value.confirm;
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['token']) {
      this.token = params['token'];
    }
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    });
  }

  exit(): void {
    this.routerService.goToLogin();
  }

  recoverPassword(): void {
    if (this.password == this.confirm) {
      this.loading = true;
      this.authService
        .recoverPassword(this.token, this.password)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          (res) => {
            this.snackerService.showSuccessful('Contraseña cambiada correctamente');
            this.exit();
          },
          (err) => {
            console.log(err);
            this.snackerService.showError(err.error.message);
          }
        );
    } else {
      this.snackerService.showError('Las contraseñas deben ser iguales');
    }
  }
}
