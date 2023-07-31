import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesResolver } from '@core/resolvers/employees.resolver';
import { PatientsResolver } from '@core/resolvers/patients.resolver';
import { AdminComponent } from '@modules/admin/admin.component';
import { LinkPatientsToEmployeesComponent } from '@modules/admin/pages/link-patients-to-employees/link-patients-to-employees.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'link-patients-to-employees',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'link-patients-to-employees',
        component: LinkPatientsToEmployeesComponent,
        resolve: {
          patients: PatientsResolver,
          employees: EmployeesResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
