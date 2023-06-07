import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { EmployeesComponent } from '../employees/employees.component';
import { InfoEmployeeComponent } from './components/info-employee/info-employee.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { AddEmployeePageComponent } from './pages/add-employee-page/add-employee-page.component';
import { EmployeesPageComponent } from './pages/employees-page/employees-page.component';

@NgModule({
  declarations: [
    EmployeesPageComponent,
    EmployeesComponent,
    InfoEmployeeComponent,
    AddEmployeePageComponent,
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
  ],
})
export class EmployeesModule {}
