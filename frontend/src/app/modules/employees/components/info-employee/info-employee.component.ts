import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeModel } from '@core/models/employee/employee.model';

@Component({
  selector: 'app-info-employee',
  templateUrl: './info-employee.component.html',
  styleUrls: ['./info-employee.component.css', '../../../../../assets/styles/info-dialog.css'],
})
export class InfoEmployeeComponent implements OnInit {
  constructor(
    private readonly dialogRef: MatDialogRef<InfoEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly employee: EmployeeModel
  ) {}

  ngOnInit(): void {}
}
