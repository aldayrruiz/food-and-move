import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPatientPageComponent } from '@modules/patients/pages/add-patient-page/add-patient-page.component';
import { AddConsultPageComponent } from '@modules/patients/pages/consults/add-consult-page/add-consult-page.component';
import { ConsultsPageComponent } from '@modules/patients/pages/consults/consults-page/consults-page.component';
import { AddFoodPageComponent } from '@modules/patients/pages/foods/add-food-page/add-food-page.component';
import { FoodsPageComponent } from '@modules/patients/pages/foods/foods-page/foods-page.component';
import { GraphicsPageComponent } from '@modules/patients/pages/graphics-page/graphics-page.component';
import { AddMovePageComponent } from '@modules/patients/pages/moves/add-move-page/add-move-page.component';
import { MovesPageComponent } from '@modules/patients/pages/moves/moves-page/moves-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { PatientsComponent } from './patients.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PatientsComponent,
    children: [
      { path: 'table', component: PatientsPageComponent },
      { path: 'add-patient', component: AddPatientPageComponent },
      // Graphics
      { path: ':patientId/graphics', component: GraphicsPageComponent },
      // Consults
      { path: ':patientId/consults', component: ConsultsPageComponent },
      { path: ':patientId/consults/add-consult', component: AddConsultPageComponent },
      { path: ':patientId/consults/edit-consult/:consultId', component: AddConsultPageComponent },
      // Foods
      { path: ':patientId/foods/:date', component: FoodsPageComponent },
      { path: ':patientId/foods/add-food/:date', component: AddFoodPageComponent },
      { path: ':patientId/foods/edit-food/:foodId', component: AddFoodPageComponent },
      // Moves
      { path: ':patientId/moves/:date', component: MovesPageComponent },
      { path: ':patientId/moves/add-move/:date', component: AddMovePageComponent },
      { path: ':patientId/moves/edit-move/:id', component: AddMovePageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
