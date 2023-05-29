import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() tableStructure: TableStructure[] = [];
  @Input() indexDisplay: number = 10;

  @Input() limit: number = 0;
  @Input() total: number = 0;
  @Input() page: number = 0;
  @Input() sortActive: string = 'name';

  @Input() offItem: boolean = false;
  @Input() keyOffItem: string = '';
  @Input() valueOffItem: any = null;

  @Input() viewShow: boolean = false;
  @Input() viewInfo: boolean = true;
  @Input() viewEdit: boolean = true;
  @Input() viewDelete: boolean = true;

  @Output() onClick = new EventEmitter<any>();
  @Output() reset = new EventEmitter<boolean>();
  @Output() changePage = new EventEmitter<PageEvent>();
  @Output() changeSort = new EventEmitter<Sort>();
  @Output() view = new EventEmitter<any>();
  @Output() info = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

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

  isOffItem(item: any): boolean {
    return item[this.keyOffItem] != this.valueOffItem;
  }
}
