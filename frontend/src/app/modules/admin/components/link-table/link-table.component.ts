import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { ObjectField } from '@shared/components/autocomplete-field/autocomplete-field.component';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';

@Component({
  selector: 'app-link-table',
  templateUrl: './link-table.component.html',
  styleUrls: ['./link-table.component.css'],
})
export class LinkTableComponent {
  @Input() tableStructure!: TableStructure[];
  @Input() items!: any[];
  @Input() objectFields!: ObjectField[];
  @Input() dataSource!: MatTableDataSource<any>;
  @Output() itemRemovedEvent = new EventEmitter<EmployeeModel>();

  tableItems: any[] = [];

  constructor() {}

  addToTable(objectField: ObjectField) {
    const employeeId = objectField?.id;
    if (!employeeId) {
      return;
    }
    // Check if employee is already in the table
    const employeeAlreadyInTable = this.tableItems.find((e) => e._id === employeeId);
    if (employeeAlreadyInTable) {
      return;
    }

    const employee = this.items.find((e) => e._id === employeeId);
    if (!employee) {
      return;
    }
    this.tableItems.push(employee);
    this.dataSource = new MatTableDataSource(this.tableItems);
  }

  removeFromTable(employee: EmployeeModel) {
    this.tableItems = this.tableItems.filter((e) => e._id !== employee._id);
    this.dataSource = new MatTableDataSource(this.tableItems);
    this.objectFields.push(this.mapToObjectField(employee));
    this.itemRemovedEvent.emit(employee);
  }

  isAddButtonDisabled(objectField?: ObjectField) {
    const employeeId = objectField?.id;
    if (!employeeId) {
      return true;
    }
    // Check if employee is already in the table
    const employeeAlreadyInTable = this.tableItems.find((e) => e._id === employeeId);
    return !!employeeAlreadyInTable;
  }

  private mapToObjectField(arr: { _id: string; name: string; surname?: string }): ObjectField {
    return {
      id: arr._id,
      value: `${arr.name} ${arr.surname}`,
    };
  }
}
