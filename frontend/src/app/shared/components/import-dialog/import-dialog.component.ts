import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DietsService } from '@core/services/diets.service';
import { RecipesService } from '@core/services/recipes.service';
import { RoutinesService } from '@core/services/routines.service';
import { ImportType } from './enums/import-type';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css'],
})
export class ImportDialogComponent implements OnInit {
  importType = ImportType;

  dataSource: any[] = [];
  items: any[] = [];
  selected: any | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public type: ImportType,
    private readonly recipesService: RecipesService,
    private readonly routinesService: RoutinesService,
    private readonly dietsService: DietsService,
    private readonly dialogRef: MatDialogRef<ImportDialogComponent>
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    switch (this.type) {
      case ImportType.Recipe: {
        this.recipesService.filter({}).subscribe(
          (res) => {
            this.items = res.items;
            this.dataSource = [...this.items];
          },
          (err) => {
            console.log(err);
          }
        );
        break;
      }
      case ImportType.Routine: {
        this.routinesService.filter({}).subscribe(
          (res) => {
            this.items = res.items;
            this.dataSource = [...this.items];
          },
          (err) => {
            console.log(err);
          }
        );
        break;
      }
      case ImportType.Diet: {
        this.dietsService.filter({}).subscribe(
          (res) => {
            this.items = res.items;
            this.dataSource = [...this.items];
          },
          (err) => {
            console.log(err);
          }
        );
        break;
      }
      default: {
        this.items = [];
        this.dataSource = [];
      }
    }
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
