import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { MovesComponent } from '../moves/moves.component';
import { MovesRoutingModule } from './moves-routing.module';
import { AddMovePageComponent } from './pages/add-move-page/add-move-page.component';
import { MovesPageComponent } from './pages/moves-page/moves-page.component';

@NgModule({
  declarations: [MovesComponent, MovesPageComponent, AddMovePageComponent],
  imports: [
    CommonModule,
    MovesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
  ],
})
export class MovesModule {}
