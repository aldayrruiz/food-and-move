import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeModel } from '@core/models/employee.model';
import { PatientModel } from '@core/models/patient.model';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { LoaderService } from '@core/services/loader.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { StorageService } from '@core/services/storage.service';
import { ImportPatientDialogComponent } from '@modules/patients/components/import-patient-dialog/import-patient-dialog.component';
import { InfoPatientComponent } from '@modules/patients/components/info-patient/info-patient.component';
import { ColumnType } from '@shared/components/table/enums/column-type';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs/operators';
import { DEFAULT_LIMIT } from '../../../../../constants/app.constants';

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  styleUrls: ['./patients-page.component.css', '../../../../../../assets/styles/crud.css'],
})
export class PatientsPageComponent implements OnInit {
  listPatients: PatientModel[] = [];
  isSmall = false;
  isLoadingResults = false;
  user: EmployeeModel | null = null;

  dataSource!: MatTableDataSource<any>;

  tableStructure: TableStructure[] = [
    { index: 0, field: 'profile_image', header: '', sort: false },
    { index: 1, field: 'name', header: 'Nombre', sort: true, type: ColumnType.NAME },
    { index: 2, field: 'phone', header: 'Teléfono', sort: true },
    { index: 3, field: 'email', header: 'Email', sort: true },
    { index: 4, field: 'birth', header: 'Nacimiento', sort: true, type: ColumnType.DATE },
  ];
  indexDisplay = 4;

  search = '';
  searchFields: string[] = ['name', 'surname', 'email', 'phone'];

  sortField = 'name';
  sortDirection = 'asc';

  page = 0;
  limit: number = DEFAULT_LIMIT;
  total = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly patientsService: PatientsService,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly dialogService: DialogService,
    private readonly dialog: MatDialog,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.loadPatients();
    this.setColumnsBySize();
  }

  loadPatients(): void {
    this.isLoadingResults = true;
    const sort =
      this.sortField == 'name'
        ? [
            { field: 'name', direction: this.sortDirection },
            { field: 'surname', direction: this.sortDirection },
          ]
        : [{ field: this.sortField, direction: this.sortDirection }];
    this.patientsService
      .filter({
        paging: {
          page: this.page + 1,
          limit: this.limit,
        },
        sorting: sort,
        search: { search: this.search, fields: this.searchFields },
        filter: {
          employee: this.user?.admin ? undefined : this.user?._id,
        },
      })
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe(
        (res) => {
          this.total = res.total;
          this.listPatients = [...res.items];
          this.dataSource = new MatTableDataSource(this.listPatients);
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
    this.breakpointObserver.observe(['(min-width:901px)']).subscribe((result) => {
      if (result.matches) {
        this.indexDisplay = 4;
      }
    });
  }

  changeSort(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortField = sort.active;
    this.page = 0;
    this.loadPatients();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadPatients();
  }

  applyFilter(): void {
    this.page = 0;
    this.loadPatients();
  }

  resetTable(): void {
    this.search = '';
    this.page = 0;
    this.loadPatients();
  }

  importPatient() {
    const objectsFields = this.listPatients.map((patient) => {
      return {
        id: patient._id,
        value: `${patient.name} ${patient.surname}`,
      };
    });
    this.dialog.open(ImportPatientDialogComponent, { data: objectsFields });
  }

  async addPatient() {
    await this.routerService.goToAddPatient();
  }

  deletePatient(patient: PatientModel): void {
    this.dialogService
      .openConfirmDialog(
        'Eliminar paciente',
        'Seguro que quieres eliminar a ' + patient.name + ' ' + patient.surname + '?'
      )
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.patientsService
            .removePatient(patient._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Paciente eliminado con éxito');
                this.loadPatients();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              }
            );
        }
      });
  }

  async editPatient(patient: PatientModel) {
    await this.routerService.goToEditPatient(patient._id);
  }

  openInfoPatient(patient: PatientModel): void {
    const dialogRef = this.dialog.open(InfoPatientComponent, {
      width: '350px',
      data: patient,
    });
    dialogRef.afterClosed();
  }

  async viewPatient(patient: PatientModel): Promise<void> {
    await this.routerService.goToPatientDetails(patient._id);
  }

  isRowOffline(patient: PatientModel): boolean {
    this.user = this.storageService.getUser();
    return patient.employees.includes(this.user?._id);
  }
}
