import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { PatientsService } from '@core/services/api/patients.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { LinkTableComponent } from '@modules/admin/components/link-table/link-table.component';
import {
  AutocompleteFieldComponent,
  ObjectField,
} from '@shared/components/autocomplete-field/autocomplete-field.component';
import { ColumnType } from '@shared/components/table/enums/column-type';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-link-patients-to-employees',
  templateUrl: './link-patients-to-employees.component.html',
  styleUrls: ['./link-patients-to-employees.component.css'],
})
export class LinkPatientsToEmployeesComponent implements OnInit {
  @ViewChild('autocompletePatients') autocompletePatients!: AutocompleteFieldComponent;
  @ViewChild('autocompleteEmployees') autocompleteEmployees!: AutocompleteFieldComponent;
  @ViewChild('patientsTable') patientsTable!: LinkTableComponent;
  @ViewChild('employeesTable') employeesTable!: LinkTableComponent;

  patientObjects!: ObjectField[];
  employeeObjects!: ObjectField[];

  patients!: PatientModel[];
  employees!: EmployeeModel[];

  // Patients table
  patientsDataSource!: MatTableDataSource<any>;
  patientsTableStructure: TableStructure[] = [
    { index: 0, field: 'profile_image', header: '', sort: false },
    { index: 1, field: 'name', header: 'Nombre', sort: true, type: ColumnType.NAME },
    { index: 2, field: 'phone', header: 'Teléfono', sort: true },
    { index: 3, field: 'email', header: 'Email', sort: true },
    { index: 4, field: 'birth', header: 'Nacimiento', sort: true, type: ColumnType.DATE },
  ];

  // Employees table
  employeesDataSource!: MatTableDataSource<any>;
  employeesTableStructure: TableStructure[] = [
    { index: 0, field: 'profile_image', header: '', sort: false },
    { index: 1, field: 'name', header: 'Nombre', sort: true, type: ColumnType.NAME },
    { index: 2, field: 'email', header: 'Email', sort: true },
    { index: 3, field: 'phone', header: 'Teléfono', sort: true },
    { index: 4, field: 'admin', header: '', sort: true, type: ColumnType.ADMIN },
  ];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly patientsService: PatientsService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.initPatients();
    this.initEmployees();
  }

  addPatientToTable() {
    const objectField = this.autocompletePatients.getValue();
    this.patientsTable.addToTable(objectField);
    this.patientObjects = this.patientObjects.filter((p) => p.id !== objectField.id);
    this.autocompletePatients.update();
  }

  removePatientFromTable() {
    this.autocompleteEmployees.update();
  }

  isAddPatientButtonDisabled() {
    if (!this.patientsTable) return false;
    const objectField = this.autocompletePatients?.getValue();
    return this.patientsTable.isAddButtonDisabled(objectField);
  }

  addEmployeeToTable() {
    const objectField = this.autocompleteEmployees.getValue();
    this.employeesTable.addToTable(objectField);
    this.employeeObjects = this.employeeObjects.filter((e) => e.id !== objectField.id);
    this.autocompleteEmployees.update();
  }

  removeEmployeeFromTable() {
    this.autocompleteEmployees.update();
  }

  isAddEmployeeButtonDisabled() {
    if (!this.employeesTable) return false;
    const objectField = this.autocompleteEmployees?.getValue();
    return this.employeesTable.isAddButtonDisabled(objectField);
  }

  isDisabledLinkAllButton() {
    if (!this.patientsTable || !this.employeesTable) return true;
    if (this.patientsTable?.dataSource?.data?.length === undefined) return true;
    if (this.employeesTable?.dataSource?.data?.length === undefined) return true;
    return this.patientsTable?.dataSource?.data?.length === 0 || this.employeesTable?.dataSource?.data?.length === 0;
  }

  linkAll() {
    const patients = this.patientsTable?.dataSource?.data;
    const employees = this.employeesTable?.dataSource?.data;
    const requests = [];
    for (const patient of patients) {
      for (const employee of employees) {
        requests.push(this.patientsService.linkEmployeePatient(employee._id, patient._id));
      }
    }
    forkJoin(requests).subscribe({
      next: () => this.snackerService.showSuccessful('Vinculados correctamente'),
      error: () => this.snackerService.showError('Error al vincular'),
    });
  }

  async unlinkAll() {
    const patients = this.patientsTable?.dataSource?.data;
    const employees = this.employeesTable?.dataSource?.data;
    const requests = [];
    for (const patient of patients) {
      for (const employee of employees) {
        requests.push(this.patientsService.unlinkEmployeePatient(employee._id, patient._id));
      }
    }
    forkJoin(requests).subscribe({
      next: () => this.snackerService.showSuccessful('Desvinculados correctamente'),
      error: () => this.snackerService.showError('Error al desvincular'),
    });
  }

  private initPatients() {
    this.activatedRoute.data.subscribe((data) => {
      this.patients = data.patients;
      this.patientObjects = this.mapToObjectFields(this.patients);
    });
  }

  private initEmployees() {
    this.activatedRoute.data.subscribe((data) => {
      this.employees = data.employees;
      this.employeeObjects = this.mapToObjectFields(this.employees);
    });
  }

  private mapToObjectFields(arr: { _id: string; name: string; surname?: string }[]): ObjectField[] {
    return arr.map((item) => {
      return this.mapToObjectField(item);
    });
  }

  private mapToObjectField(arr: { _id: string; name: string; surname?: string }): ObjectField {
    return {
      id: arr._id,
      value: `${arr.name} ${arr.surname}`,
    };
  }
}
