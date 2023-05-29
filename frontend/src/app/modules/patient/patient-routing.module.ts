import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientPageComponent } from './pages/patient-page/patient-page.component';

const routes: Routes = [
  {
    path: '',
    component: PatientPageComponent,
    children: [
      { path: '', redirectTo: 'graphics', pathMatch: 'full' },
      {
        path: 'graphics',
        loadChildren: () =>
          import('@modules/graphics/graphics.module').then((x) => x.GraphicsModule),
      },
      {
        path: 'consults',
        loadChildren: () =>
          import('@modules/consults/consults.module').then((x) => x.ConsultsModule),
      },
      {
        path: 'foods',
        loadChildren: () => import('@modules/foods/foods.module').then((x) => x.FoodsModule),
      },
      {
        path: 'moves',
        loadChildren: () => import('@modules/moves/moves.module').then((x) => x.MovesModule),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
