import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutineComponentsModule } from '@modules/routines/components/routine-components.module';
import { AddWeekRoutineComponent } from '@modules/week-routines/components/add-week-routine/add-week-routine.component';
import { AddRoutineForWeekRoutinePageComponent } from '@modules/week-routines/pages/add-routine-for-week-routine-page/add-routine-for-week-routine-page.component';
import { EditWeekRoutinePageComponent } from '@modules/week-routines/pages/edit-week-routine/edit-week-routine-page.component';
import { WeekRoutinesPageComponent } from '@modules/week-routines/pages/week-routines-page/week-routines-page.component';
import { WeekRoutinesComponent } from '@modules/week-routines/week-routines.component';
import { WeekRoutinesRoutingModule } from '@modules/week-routines/wek-routines-routing.module';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    WeekRoutinesComponent,
    WeekRoutinesPageComponent,
    EditWeekRoutinePageComponent,
    AddRoutineForWeekRoutinePageComponent,
    AddWeekRoutineComponent,
  ],
  imports: [
    CommonModule,
    WeekRoutinesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
    RoutineComponentsModule,
  ],
  providers: [TitleCasePipe],
})
export class WeekRoutinesModule {}
