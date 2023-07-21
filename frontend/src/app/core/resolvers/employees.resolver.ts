import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { EmployeesService } from '@core/services/api/employees.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeesResolver implements Resolve<EmployeeModel[]> {
  constructor(private employeesService: EmployeesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EmployeeModel[]> {
    return this.employeesService.getAllEmployees();
  }
}
