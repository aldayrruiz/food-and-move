import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatModule } from '../../shared/modules/mat/mat.module';
import { PatientPageComponent } from './pages/patient-page/patient-page.component';
import { PatientRoutingModule } from './patient-routing.module';

@NgModule({
  declarations: [PatientPageComponent],
  imports: [CommonModule, PatientRoutingModule, MatModule],
})
export class PatientModule {}
