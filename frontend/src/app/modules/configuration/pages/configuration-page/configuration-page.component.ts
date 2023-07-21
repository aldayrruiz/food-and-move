import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { AuthService } from '@core/services/api/auth.service';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-configuration-page',
  templateUrl: './configuration-page.component.html',
  styleUrls: ['./configuration-page.component.css', '../../../../../assets/styles/form.css'],
})
export class ConfigurationPageComponent implements OnInit {
  employee: EmployeeModel | null = null;

  constructor(private readonly authService: AuthService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.employee = this.storageService.getUser();
  }

  setEmployee(employee: EmployeeModel | null): void {
    this.employee = employee;
  }
}
