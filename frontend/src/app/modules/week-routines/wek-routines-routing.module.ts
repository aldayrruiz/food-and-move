import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutineFromWeekRoutineResolver } from '@core/resolvers/routine-from-week-routine.resolver';
import { WeekRoutineResolver } from '@core/resolvers/week-routine.resolver';
import { AddRoutineForWeekRoutinePageComponent } from '@modules/week-routines/pages/add-routine-for-week-routine-page/add-routine-for-week-routine-page.component';
import { EditWeekRoutinePageComponent } from '@modules/week-routines/pages/edit-week-routine/edit-week-routine-page.component';
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
      {
        path: 'edit/:weekRoutineId/add-routine/:day',
        component: AddRoutineForWeekRoutinePageComponent,
        resolve: {
          weekRoutine: WeekRoutineResolver,
        },
      },
      {
        path: 'edit/:weekRoutineId/edit-routine/:day/:routineId',
        component: AddRoutineForWeekRoutinePageComponent,
        resolve: {
          weekRoutine: WeekRoutineResolver,
          routine: RoutineFromWeekRoutineResolver,
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
