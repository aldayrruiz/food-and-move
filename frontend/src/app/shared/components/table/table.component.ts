import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '@core/services/storage.service';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() loading = false;
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() tableStructure: TableStructure[] = [];
  @Input() indexDisplay = 10;

  @Input() limit = 0;
  @Input() total = 0;
  @Input() page = 0;
  @Input() sortActive = 'name';

  @Input() viewMenu = true;
  @Input() viewShow = false;
  @Input() viewInfo = true;
  @Input() viewEdit = true;
  @Input() viewDelete = true;

  // A function that is used to change color of the row if it is offline.
  @Input() isRowOffline: (args: any) => boolean = () => false;

  @Output() onClick = new EventEmitter<any>();
  @Output() reset = new EventEmitter<boolean>();
  @Output() changePage = new EventEmitter<PageEvent>();
  @Output() changeSort = new EventEmitter<Sort>();
  @Output() view = new EventEmitter<any>();
  @Output() info = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  // Some functions like isRowOffline are not used in this class, but they are used in parents classes.
  // So, when we Input them, we need services used in the function of the parent.
  constructor(public storageService: StorageService) {}

  getColumnsToDisplay(): string[] {
    return [
      ...this.tableStructure
        .filter((element) => {
          return element.index <= this.indexDisplay;
        })
        .map((element) => {
          return element.field;
        }),
      'actions',
    ];
  }

  clickItem(element: any): void {
    this.onClick.emit(element);
  }

  resetTable(): void {
    this.reset.emit(true);
  }

  changePageTable(value: PageEvent): void {
    this.changePage.emit(value);
  }

  changeSortTable(value: Sort): void {
    this.changeSort.emit(value);
  }

  viewElement(element: any): void {
    this.view.emit(element);
  }

  infoElement(element: any): void {
    this.info.emit(element);
  }

  editElement(element: any): void {
    this.edit.emit(element);
  }

  deleteElement(element: any): void {
    this.delete.emit(element);
  }

  getValue(obj: any, path: string): any {
    if (path === 'name') {
      return obj;
    }

    const ifNotDot = path.indexOf('.') === -1;
    if (ifNotDot) {
      return obj[path];
    }

    const fields = path.split('.');
    let value = obj;
    for (const field of fields) {
      value = value?.[field];
    }
    return value;
  }
}
