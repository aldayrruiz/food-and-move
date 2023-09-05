import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutineResolver } from '@core/resolvers/routine.resolver';
import { AddRoutinePageComponent } from './pages/add-routine-page/add-routine-page.component';
import { RoutinesPageComponent } from './pages/routines-page/routines-page.component';
import { RoutinesComponent } from './routines.component';

const routes: Routes = [
  {
    path: '',
    component: RoutinesComponent,
    children: [
      { path: '', component: RoutinesPageComponent },
      { path: 'add-routine', component: AddRoutinePageComponent },
      { path: 'edit-routine/:routineId', component: AddRoutinePageComponent, resolve: { routine: RoutineResolver } },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutinesRoutingModule {}
