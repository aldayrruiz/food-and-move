import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@shared/modules/mat/mat.module';
import { PhotoPipe } from '@shared/pipes/photo.pipe';
import { SharedModule } from '@shared/shared.module';
import { PatientsComponent } from '../patients/patients.component';
import { InfoPatientComponent } from './components/info-patient/info-patient.component';
import { AddPatientPageComponent } from './pages/add-patient-page/add-patient-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { PatientsRoutingModule } from './patients-routing.module';

@NgModule({
  declarations: [
    PatientsComponent,
    PatientsPageComponent,
    InfoPatientComponent,
    AddPatientPageComponent,
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
  ],
  providers: [DatePipe, PhotoPipe],
})
export class PatientsModule {}
