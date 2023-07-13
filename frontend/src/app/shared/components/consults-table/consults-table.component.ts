import { Component, OnInit } from '@angular/core';
import { StorageService } from '@core/services/storage.service';
import { TableComponent } from '@shared/components/table/table.component';

@Component({
  selector: 'app-consults-table',
  templateUrl: './consults-table.component.html',
  styleUrls: ['./consults-table.component.css'],
})
export class ConsultsTableComponent extends TableComponent implements OnInit {
  constructor(public override storageService: StorageService) {
    super(storageService);
  }

  ngOnInit(): void {}

  override getColumnsToDisplay(): string[] {
    return [
      ...this.tableStructure
        .filter((element) => {
          return element.index <= this.indexDisplay;
        })
        .map((element) => {
          return element.field;
        }),
      'info',
      'actions',
    ];
  }
}
