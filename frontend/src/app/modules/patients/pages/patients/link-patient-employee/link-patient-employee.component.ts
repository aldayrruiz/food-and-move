import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EmployeeModel } from '@core/models/employee.model';
import { PatientModel } from '@core/models/patient.model';
import { EmployeesService } from '@core/services/employees.service';
import { PatientsService } from '@core/services/patients.service';
import { SnackerService } from '@core/services/snacker.service';
import { InfoEmployeeComponent } from '@modules/employees/components/info-employee/info-employee.component';
import {
  AutocompleteFieldComponent,
  ObjectField,
} from '@shared/components/autocomplete-field/autocomplete-field.component';
import { ColumnType } from '@shared/components/table/enums/column-type';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { map } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DEFAULT_LIMIT } from '../../../../../constants/app.constants';

@Component({
  selector: 'app-link-patient-employee',
  templateUrl: './link-patient-employee.component.html',
  styleUrls: ['./link-patient-employee.component.css', '../../../../../../assets/styles/crud.css'],
})
export class LinkPatientEmployeeComponent implements OnInit {
  @ViewChild('employeeField') employeeField!: AutocompleteFieldComponent;
  @Input('patient') patient!: PatientModel;
  listEmployees: EmployeeModel[] = [];
  isSmall = false;
  isLoadingResults = false;

  dataSource!: MatTableDataSource<any>;

  indexDisplay = 4;
  tableStructure: TableStructure[] = [
    { index: 0, field: 'profile_image', header: '', sort: false },
    { index: 1, field: 'name', header: 'Nombre', sort: true, type: ColumnType.NAME },
    { index: 2, field: 'email', header: 'Email', sort: true },
    { index: 3, field: 'phone', header: 'Teléfono', sort: true },
    { index: 4, field: 'admin', header: '', sort: true, type: ColumnType.ADMIN },
  ];

  search = '';
  searchFields: string[] = ['name', 'surname', 'email', 'phone'];

  sortField = 'name';
  sortDirection = 'asc';

  page = 0;
  limit: number = DEFAULT_LIMIT;
  total = 0;

  employees!: EmployeeModel[];
  employeeObjectFields!: ObjectField[];

  constructor(
    private readonly dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly employeesService: EmployeesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly patientsService: PatientsService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.initEmployees();
    this.loadEmployees();
  }

  initEmployees(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.employees = data['employees'];
      this.employeeObjectFields = this.employees.map((employee) => ({
        id: employee._id,
        value: `${employee.name} ${employee.surname}`,
      }));
    });
  }

  loadEmployees(): void {
    this.isLoadingResults = true;
    const sort =
      this.sortField == 'name'
        ? [
            { field: 'name', direction: this.sortDirection },
            { field: 'surname', direction: this.sortDirection },
          ]
        : [{ field: this.sortField, direction: this.sortDirection }];
    this.employeesService
      .filter({
        paging: {
          page: this.page + 1,
          limit: this.limit,
        },
        sorting: sort,
        search: { search: this.search, fields: this.searchFields },
        filter: {},
      })
      .pipe(
        map((res) => {
          const items = res.items.filter((item) => this.patient.employees.includes(item._id));
          return { ...res, items };
        }),
        finalize(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.total = res.total;
          this.listEmployees = [...res.items];
          this.dataSource = new MatTableDataSource(this.listEmployees);
        },
        error: (err) => console.log(err),
      });
  }

  linkEmployeeToPatient(): void {
    const employeeObject = this.employeeField.getValue();
    if (!employeeObject) {
      return;
    }
    this.patientsService.linkEmployeePatient(employeeObject.id, this.patient._id).subscribe({
      next: () => {
        this.snackerService.showSuccessful('Profesional vinculado correctamente');
        this.reloadPatient();
        this.loadEmployees();
      },
      error: (err) => {
        this.snackerService.showError(err);
      },
    });
  }

  unlinkEmployeeToPatient(): void {
    const employeeObject = this.employeeField.getValue();
    if (!employeeObject) {
      return;
    }
    this.patientsService.unlinkEmployeePatient(employeeObject.id, this.patient._id).subscribe({
      next: () => {
        this.snackerService.showSuccessful('Profesional desvinculado correctamente');
        this.reloadPatient();
        this.loadEmployees();
      },
      error: (err) => {
        this.snackerService.showError(err);
      },
    });
  }

  changeSort(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortField = sort.active;
    this.page = 0;
    this.loadEmployees();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadEmployees();
  }

  applyFilter(): void {
    this.page = 0;
    this.loadEmployees();
  }

  resetTable(): void {
    this.search = '';
    this.page = 0;
    this.loadEmployees();
  }

  openInfoEmployee(employee: EmployeeModel): void {
    const dialogRef = this.dialog.open(InfoEmployeeComponent, {
      width: '350px',
      data: employee,
    });
    dialogRef.afterClosed();
  }

  private reloadPatient(): void {
    this.patientsService.getPatient(this.patient._id).subscribe({
      next: (res) => {
        this.patient = res;
      },
    });
  }
}
