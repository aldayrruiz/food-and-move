import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  {
    path: 'patients',
    loadChildren: () => import('@modules/patients/patients.module').then((x) => x.PatientsModule),
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('@modules/employees/employees.module').then((x) => x.EmployeesModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'recipes',
    loadChildren: () => import('@modules/recipes/recipes.module').then((x) => x.RecipesModule),
  },
  {
    path: 'diets',
    loadChildren: () => import('@modules/diets/diets.module').then((x) => x.DietsModule),
  },
  {
    path: 'routines',
    loadChildren: () => import('@modules/routines/routines.module').then((x) => x.RoutinesModule),
  },
  {
    path: 'week-routines',
    loadChildren: () =>
      import('@modules/week-routines/week-routines.module').then((x) => x.WeekRoutinesModule),
  },
  {
    path: 'configuration',
    loadChildren: () =>
      import('@modules/configuration/configuration.module').then((x) => x.ConfigurationModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
