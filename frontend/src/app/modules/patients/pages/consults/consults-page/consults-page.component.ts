import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConsultModel } from '@core/models/consult/consult.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { ConsultsService } from '@core/services/consults.service';
import { DialogService } from '@core/services/dialog.service';
import { LoaderService } from '@core/services/loader.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { InfoConsultComponent } from '@modules/patients/components/info-consult/info-consult.component';
import { ColumnType } from '@shared/components/table/enums/column-type';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs/operators';
import { DEFAULT_LIMIT } from '../../../../../constants/app.constants';

@Component({
  selector: 'app-consults-page',
  templateUrl: './consults-page.component.html',
  styleUrls: ['./consults-page.component.css', '../../../../../../assets/styles/crud.css'],
})
export class ConsultsPageComponent implements OnInit {
  patient!: PatientModel;

  listConsults: ConsultModel[] = [];
  isSmall = false;
  isLoadingResults = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  tableStructure: TableStructure[] = [
    { index: 1, field: 'created_at', header: 'Fecha', sort: true, type: ColumnType.DATE },
    { index: 2, field: 'owner', header: 'Profesional', sort: true, type: ColumnType.NAME },
    { index: 3, field: 'diet.title', header: 'Dieta', sort: true },
  ];
  indexDisplay = 10;

  sortField = 'created_at';
  sortDirection = 'desc';

  limit: number = DEFAULT_LIMIT;
  page = 0;
  total = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly patientsService: PatientsService,
    private readonly consultsService: ConsultsService,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly dialogService: DialogService,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initPatient();
    this.loadConsults();
  }

  async editConsult(consult: ConsultModel) {
    await this.routerService.goToEditConsult(this.patient._id, consult._id);
  }

  deleteConsult(consult: ConsultModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar Consulta', 'Seguro que quieres eliminar  la consulta?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.consultsService
            .removeConsult(consult._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: () => {
                this.snackerService.showSuccessful('Consulta eliminado con éxito');
                this.loadConsults();
              },
              error: (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              },
            });
        }
      });
  }

  changeSort(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortField = sort.active;
    this.page = 0;
    this.loadConsults();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadConsults();
  }

  resetTable(): void {
    this.page = 0;
    this.loadConsults();
  }

  async addConsult() {
    await this.routerService.goToAddConsult(this.patient._id);
  }

  openInfoConsult(consult: ConsultModel): void {
    const dialogRef = this.dialog.open(InfoConsultComponent, {
      width: '500px',
      data: consult,
    });
    dialogRef.afterClosed();
  }

  private initPatient() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.patient = data['patient'];
      },
    });
  }

  private loadConsults(): void {
    if (!this.patient) return;
    this.isLoadingResults = true;
    this.consultsService
      .filter({
        paging: { page: this.page + 1, limit: this.limit },
        sorting: [{ field: this.sortField, direction: this.sortDirection }],
        filter: { patient: this.patient?._id },
        populate: ['owner', 'diet'],
      })
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.total = res.total;
          this.listConsults = [...res.items];
          this.dataSource = new MatTableDataSource(this.listConsults);
          console.log(this.dataSource);
        },
        error: (err) => console.log(err),
      });
  }
}
