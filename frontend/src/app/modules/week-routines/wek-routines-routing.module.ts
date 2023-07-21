import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeekRoutineResolver } from '@core/resolvers/week-routine.resolver';
import { EditWeekRoutinePageComponent } from '@modules/week-routines/pages/edit-diet-page/edit-week-routine-page.component';
import { WeekRoutinesPageComponent } from '@modules/week-routines/pages/week-routines-page/week-routines-page.component';
import { WeekRoutinesComponent } from '@modules/week-routines/week-routines.component';

const routes: Routes = [
  {
    path: '',
    component: WeekRoutinesComponent,
    children: [
      { path: '', component: WeekRoutinesPageComponent },
      {
        path: 'edit/:weekRoutineId',
        component: EditWeekRoutinePageComponent,
        resolve: {
          weekRoutine: WeekRoutineResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeekRoutinesRoutingModule {}
