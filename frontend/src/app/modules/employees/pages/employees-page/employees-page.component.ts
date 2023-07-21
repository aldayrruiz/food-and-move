import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { EmployeesService } from '@core/services/api/employees.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { InfoEmployeeComponent } from '@modules/employees/components/info-employee/info-employee.component';
import { ColumnType } from '@shared/components/table/enums/column-type';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs/operators';
import { DEFAULT_LIMIT } from 'src/app/constants/app.constants';
@Component({
  selector: 'app-employees-page',
  templateUrl: './employees-page.component.html',
  styleUrls: ['./employees-page.component.css', '../../../../../assets/styles/crud.css'],
})
export class EmployeesPageComponent implements OnInit {
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

  constructor(
    private readonly dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly employeesService: EmployeesService,
    private readonly loaderService: LoaderService,
    private readonly routerService: RouterService,
    private readonly dialogService: DialogService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.setColumnsBySize();
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
        finalize(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe(
        (res) => {
          this.total = res.total;
          this.listEmployees = [...res.items];
          this.dataSource = new MatTableDataSource(this.listEmployees);
        },
        (err) => console.log(err)
      );
  }

  setColumnsBySize(): void {
    this.breakpointObserver.observe(['(max-width: 959px)']).subscribe((result) => {
      this.isSmall = false;
      if (result.matches) {
        this.isSmall = true;
      }
    });
    this.breakpointObserver
      .observe(['(max-width: 900px)', '(min-width:651px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.indexDisplay = 3;
        }
      });
    this.breakpointObserver
      .observe(['(max-width: 650px)', '(min-width:551px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.indexDisplay = 2;
        }
      });
    this.breakpointObserver.observe(['(max-width: 550px)']).subscribe((result) => {
      if (result.matches) {
        this.indexDisplay = 1;
      }
    });
    this.breakpointObserver.observe(['(min-width: 901px)']).subscribe((result) => {
      if (result.matches) {
        this.indexDisplay = 4;
      }
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

  addEmployee(): void {
    this.routerService.goToAddEmployee();
  }

  deleteEmployee(employee: EmployeeModel): void {
    this.dialogService
      .openConfirmDialog(
        'Eliminar personal',
        'Seguro que quieres eliminar a ' + employee.name + '?'
      )
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.employeesService
            .removeEmployee(employee._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Personal eliminado con éxito');
                this.loadEmployees();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              }
            );
        }
      });
  }

  editEmployee(employee: EmployeeModel): void {
    this.routerService.goToEditEmployee(employee._id);
  }

  openInfoEmployee(employee: EmployeeModel): void {
    const dialogRef = this.dialog.open(InfoEmployeeComponent, {
      width: '350px',
      data: employee,
    });
    dialogRef.afterClosed();
  }
}
