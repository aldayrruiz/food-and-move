import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportWeekRoutineDialogComponent } from '@modules/week-routines/dialogs/import-week-routine-dialog/import-week-routine-dialog.component';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ImportWeekRoutineDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatModule, SharedModule],
  exports: [ImportWeekRoutineDialogComponent],
})
export class WeekRoutinesDialogsModule {}
