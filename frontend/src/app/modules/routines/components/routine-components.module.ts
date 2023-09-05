import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormRoutineComponent } from '@modules/routines/components/form-routine/form-routine.component';
import { InfoRoutineComponent } from '@modules/routines/components/info-routine/info-routine.component';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [InfoRoutineComponent, FormRoutineComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatModule, SharedModule],
  exports: [InfoRoutineComponent, FormRoutineComponent],
  providers: [TitleCasePipe],
})
export class RoutineComponentsModule {}
