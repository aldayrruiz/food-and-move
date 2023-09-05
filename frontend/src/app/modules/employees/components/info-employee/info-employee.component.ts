import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { PatientsService } from '@core/services/api/patients.service';

@Component({
  selector: 'app-info-employee',
  templateUrl: './info-employee.component.html',
  styleUrls: ['./info-employee.component.css', '../../../../../assets/styles/info-dialog.css'],
})
export class InfoEmployeeComponent implements OnInit {
  patients!: PatientModel[];

  constructor(
    private readonly dialogRef: MatDialogRef<InfoEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly employee: EmployeeModel,
    private readonly patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.initPatients();
  }

  initPatients() {
    this.patientsService.getPatientsByEmployee(this.employee._id).subscribe({
      next: (patients) => (this.patients = patients),
      error: (err) => {},
    });
  }
}
