import { Component, Input } from '@angular/core';
import { PatientModel } from '@core/models/patient/patient.model';
import { RouterService } from '@core/services/router.service';

@Component({
  selector: 'app-header-patient',
  templateUrl: './header-patient.component.html',
  styleUrls: ['./header-patient.component.css'],
})
export class HeaderPatientComponent {
  @Input() patient?: PatientModel;
  @Input() title = '';

  constructor(private readonly routerService: RouterService) {}

  exit(): void {
    this.routerService.goToPatients();
  }

  goToGraphics(): void {
    if (!this.patient) return;
    this.routerService.goToGraphics(this.patient._id);
  }

  goToConsults(): void {
    if (!this.patient) return;
    this.routerService.goToConsults(this.patient._id);
  }

  goToFoods(): void {
    if (!this.patient) return;
    this.routerService.goToFoods(this.patient._id);
  }

  goToMoves(): void {
    if (!this.patient) return;
    this.routerService.goToMoves(this.patient._id);
  }

  goToFeedback() {
    if (!this.patient) return;
    this.routerService.goToFeedback(this.patient._id);
  }
}
