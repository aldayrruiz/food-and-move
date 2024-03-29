import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoConsultComponent } from '@modules/patients/components/info-consult/info-consult.component';
import { AddConsultPageComponent } from '@modules/patients/pages/consults/add-consult-page/add-consult-page.component';
import { ConsultsPageComponent } from '@modules/patients/pages/consults/consults-page/consults-page.component';
import { AddFoodPageComponent } from '@modules/patients/pages/foods/add-food-page/add-food-page.component';
import { FoodsPageComponent } from '@modules/patients/pages/foods/foods-page/foods-page.component';
import { GraphicsPageComponent } from '@modules/patients/pages/graphics-page/graphics-page.component';
import { AddMovePageComponent } from '@modules/patients/pages/moves/add-move-page/add-move-page.component';
import { MovesPageComponent } from '@modules/patients/pages/moves/moves-page/moves-page.component';
import { AddPatientPageComponent } from '@modules/patients/pages/patients/add-patient-page/add-patient-page.component';
import { PatientsPageComponent } from '@modules/patients/pages/patients/patients-page/patients-page.component';
import { WeekRoutinesDialogsModule } from '@modules/week-routines/dialogs/week-routines-dialogs.module';
import { MatModule } from '@shared/modules/mat/mat.module';
import { PhotoPipe } from '@shared/pipes/photo.pipe';
import { SharedModule } from '@shared/shared.module';
import { PatientsComponent } from '../patients/patients.component';
import { FeedbackRowComponent } from './components/feedback-row/feedback-row.component';
import { ImportPatientDialogComponent } from './components/import-patient-dialog/import-patient-dialog.component';
import { InfoPatientComponent } from './components/info-patient/info-patient.component';
import { FeedbackPageComponent } from './pages/feedback-page/feedback-page.component';
import { LinkPatientEmployeeComponent } from './pages/patients/link-patient-employee/link-patient-employee.component';
import { PatientsRoutingModule } from './patients-routing.module';

@NgModule({
  declarations: [
    PatientsComponent,
    PatientsPageComponent,
    InfoPatientComponent,
    AddPatientPageComponent,
    // Graphics
    GraphicsPageComponent,
    // Consults
    ConsultsPageComponent,
    AddConsultPageComponent,
    InfoConsultComponent,
    //   Foods
    FoodsPageComponent,
    AddFoodPageComponent,
    // Moves
    MovesPageComponent,
    AddMovePageComponent,
    LinkPatientEmployeeComponent,
    ImportPatientDialogComponent,
    // Feedback
    FeedbackPageComponent,
    FeedbackRowComponent,
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
    WeekRoutinesDialogsModule,
  ],
  providers: [DatePipe, PhotoPipe],
})
export class PatientsModule {}
