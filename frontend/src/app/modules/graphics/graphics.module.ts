import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatModule } from '../../shared/modules/mat/mat.module';
import { SharedModule } from '../../shared/shared.module';
import { GraphicsRoutingModule } from './graphics-routing.module';
import { GraphicsComponent } from './graphics.component';
import { GraphicsPageComponent } from './pages/graphics-page/graphics-page.component';

@NgModule({
  declarations: [GraphicsComponent, GraphicsPageComponent],
  imports: [
    CommonModule,
    GraphicsRoutingModule,
    MatModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgChartsModule,
  ],
})
export class GraphicsModule {}
