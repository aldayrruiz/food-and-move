import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';

@Component({
  selector: 'app-import-week-routine-dialog',
  templateUrl: './import-week-routine-dialog.component.html',
  styleUrls: ['./import-week-routine-dialog.component.css'],
})
export class ImportWeekRoutineDialogComponent implements OnInit {
  dataSource: any[] = [];
  items: WeekRoutineModel[] = [];
  selected: any;
  custom = 'CUSTOM';
  showCustom = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly weekRoutinesService: WeekRoutinesService,
    private readonly dialogRef: MatDialogRef<ImportWeekRoutineDialogComponent>
  ) {}

  ngOnInit(): void {
    this.showCustom = this.data.showCustom;
    this.loadItems();
  }

  loadItems(): void {
    this.weekRoutinesService.filter({}).subscribe({
      next: (res) => {
        this.items = res.items;
        this.dataSource = [...this.items];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectItem(item: any): void {
    this.selected = item;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const cpy_data = [...this.items];
    this.dataSource = cpy_data.filter((item) =>
      item.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    );
  }

  exit(): void {
    this.dialogRef.close();
  }
}
