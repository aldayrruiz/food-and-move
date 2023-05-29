import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from '@core/models/employee.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-configuration-page',
  templateUrl: './configuration-page.component.html',
  styleUrls: ['./configuration-page.component.css', '../../../../../assets/styles/form.css'],
})
export class ConfigurationPageComponent implements OnInit {
  employee: EmployeeModel | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(
      (res) => {
        this.employee = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setEmployee(employee: EmployeeModel | null): void {
    this.employee = employee;
  }
}
