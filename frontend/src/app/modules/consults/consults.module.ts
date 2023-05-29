import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { ConsultsComponent } from '../consults/consults.component';
import { InfoConsultComponent } from './components/info-consult/info-consult.component';
import { ConsultsRoutingModule } from './consults-routing.module';
import { AddConsultPageComponent } from './pages/add-consult-page/add-consult-page.component';
import { ConsultsPageComponent } from './pages/consults-page/consults-page.component';

@NgModule({
  declarations: [
    ConsultsComponent,
    ConsultsPageComponent,
    AddConsultPageComponent,
    InfoConsultComponent,
  ],
  imports: [
    CommonModule,
    ConsultsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
  ],
})
export class ConsultsModule {}
