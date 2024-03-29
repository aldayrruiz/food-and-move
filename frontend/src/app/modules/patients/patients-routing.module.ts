import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultResolver } from '@core/resolvers/consult.resolver';
import { EmployeesResolver } from '@core/resolvers/employees.resolver';
import { FoodResolver } from '@core/resolvers/food.resolver';
import { MoveResolver } from '@core/resolvers/move.resolver';
import { PatientResolver } from '@core/resolvers/patient.resolver';
import { AddConsultPageComponent } from '@modules/patients/pages/consults/add-consult-page/add-consult-page.component';
import { ConsultsPageComponent } from '@modules/patients/pages/consults/consults-page/consults-page.component';
import { FeedbackPageComponent } from '@modules/patients/pages/feedback-page/feedback-page.component';
import { AddFoodPageComponent } from '@modules/patients/pages/foods/add-food-page/add-food-page.component';
import { FoodsPageComponent } from '@modules/patients/pages/foods/foods-page/foods-page.component';
import { GraphicsPageComponent } from '@modules/patients/pages/graphics-page/graphics-page.component';
import { AddMovePageComponent } from '@modules/patients/pages/moves/add-move-page/add-move-page.component';
import { MovesPageComponent } from '@modules/patients/pages/moves/moves-page/moves-page.component';
import { AddPatientPageComponent } from '@modules/patients/pages/patients/add-patient-page/add-patient-page.component';
import { PatientsPageComponent } from '@modules/patients/pages/patients/patients-page/patients-page.component';
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
      {
        path: 'edit-patient/:patientId',
        component: AddPatientPageComponent,
        resolve: { patient: PatientResolver, employees: EmployeesResolver },
      },
      // Consults
      {
        path: ':patientId/consults',
        component: ConsultsPageComponent,
        resolve: { patient: PatientResolver },
      },
      {
        path: ':patientId/consults/add-consult',
        component: AddConsultPageComponent,
        resolve: { patient: PatientResolver },
      },
      {
        path: ':patientId/consults/edit-consult/:consultId',
        component: AddConsultPageComponent,
        resolve: { patient: PatientResolver, consult: ConsultResolver },
      },
      // Graphics
      { path: ':patientId/graphics', component: GraphicsPageComponent },
      // Foods
      {
        path: ':patientId/foods/:date',
        component: FoodsPageComponent,
        resolve: { patient: PatientResolver },
      },
      {
        path: ':patientId/foods/add-food/:date',
        component: AddFoodPageComponent,
        resolve: { patient: PatientResolver },
      },
      {
        path: ':patientId/foods/edit-food/:foodId',
        component: AddFoodPageComponent,
        resolve: { patient: PatientResolver, food: FoodResolver },
      },
      // Moves
      {
        path: ':patientId/moves/:date',
        component: MovesPageComponent,
        resolve: { patient: PatientResolver },
      },
      {
        path: ':patientId/moves/add-move/:date',
        component: AddMovePageComponent,
        resolve: { patient: PatientResolver },
      },
      {
        path: ':patientId/moves/edit-move/:moveId',
        component: AddMovePageComponent,
        resolve: { patient: PatientResolver, move: MoveResolver },
      },
      // Feedback
      {
        path: ':patientId/feedback',
        component: FeedbackPageComponent,
        resolve: { patient: PatientResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
