import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutineComponentsModule } from '@modules/routines/components/routine-components.module';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { RoutinesComponent } from '../routines/routines.component';
import { AddRoutinePageComponent } from './pages/add-routine-page/add-routine-page.component';
import { RoutinesPageComponent } from './pages/routines-page/routines-page.component';
import { RoutinesRoutingModule } from './routines-routing.module';

@NgModule({
  declarations: [RoutinesComponent, RoutinesPageComponent, AddRoutinePageComponent],
  imports: [
    CommonModule,
    RoutinesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
    RoutineComponentsModule,
  ],
})
export class RoutinesModule {}
