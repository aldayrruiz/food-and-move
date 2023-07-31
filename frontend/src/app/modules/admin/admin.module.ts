import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LinkTableComponent } from './components/link-table/link-table.component';
import { LinkPatientsToEmployeesComponent } from './pages/link-patients-to-employees/link-patients-to-employees.component';

@NgModule({
  declarations: [AdminComponent, LinkPatientsToEmployeesComponent, LinkTableComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule, MatButtonModule],
})
export class AdminModule {}
