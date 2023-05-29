import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphicsComponent } from './graphics.component';
import { GraphicsPageComponent } from './pages/graphics-page/graphics-page.component';

const routes: Routes = [
  {
    path: '',
    component: GraphicsComponent,
    children: [
      { path: '', component: GraphicsPageComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraphicsRoutingModule {}
