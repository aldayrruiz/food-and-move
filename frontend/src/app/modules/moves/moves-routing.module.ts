import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovesComponent } from './moves.component';
import { AddMovePageComponent } from './pages/add-move-page/add-move-page.component';
import { MovesPageComponent } from './pages/moves-page/moves-page.component';

const routes: Routes = [
  {
    path: '',
    component: MovesComponent,
    children: [
      { path: ':date', component: MovesPageComponent },
      { path: 'add-move/:date', component: AddMovePageComponent },
      { path: 'edit-move/:id', component: AddMovePageComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovesRoutingModule {}
