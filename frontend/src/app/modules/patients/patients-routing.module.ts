import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPatientPageComponent } from './pages/add-patient-page/add-patient-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { PatientsComponent } from './patients.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      { path: '', component: PatientsPageComponent },
      { path: 'add-patient', component: AddPatientPageComponent },
      { path: 'edit-patient/:id', component: AddPatientPageComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
