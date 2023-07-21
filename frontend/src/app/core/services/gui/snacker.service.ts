import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackerService {
  private duration = 3000;

  constructor(private snackBar: MatSnackBar) {}

  showSuccessful(message: string): void {
    this.snackBar.open(message, '', {
      duration: this.duration,
      panelClass: ['successful-color-snackbar'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, '', {
      duration: this.duration,
      panelClass: ['error-color-snackbar'],
    });
  }

  showWithAction(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: this.duration,
    });
  }
}
