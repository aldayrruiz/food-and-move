import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WeekRoutineModel } from '@core/models/week-routine/week-routine';
import { WeekRoutinesService } from '@core/services/api/week-routines.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { AddWeekRoutineComponent } from '@modules/week-routines/components/add-week-routine/add-week-routine.component';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs';
import { DEFAULT_LIMIT } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-week-routines-page',
  templateUrl: './week-routines-page.component.html',
  styleUrls: ['./week-routines-page.component.css', '../../../../../assets/styles/crud.css'],
})
export class WeekRoutinesPageComponent implements OnInit {
  listWeekRoutines: WeekRoutineModel[] = [];
  isSmall = false;
  isLoadingResults = false;

  dataSource!: MatTableDataSource<any>;

  tableStructure: TableStructure[] = [
    { index: 1, field: 'title', header: 'Título', sort: true },
    { index: 2, field: 'description', header: 'Descripción', sort: true },
  ];
  indexDisplay = 2;

  search = '';
  searchFields: string[] = ['title'];

  sortField = 'title';
  sortDirection = 'asc';

  limit = DEFAULT_LIMIT;
  page = 0;
  total = 0;

  constructor(
    private readonly weekRoutinesService: WeekRoutinesService,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly routerService: RouterService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadWeekRoutines();
  }

  loadWeekRoutines(): void {
    this.isLoadingResults = true;
    this.weekRoutinesService
      .filter({
        paging: {
          page: this.page + 1,
          limit: this.limit,
        },
        sorting: [{ field: this.sortField, direction: this.sortDirection }],
        search: { search: this.search, fields: this.searchFields },
        filter: {},
      })
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.total = res.total;
          this.listWeekRoutines = [...res.items];
          this.dataSource = new MatTableDataSource(this.listWeekRoutines);
        },
        error: (err) => console.log(err),
      });
  }

  changeSort(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortField = sort.active;
    this.page = 0;
    this.loadWeekRoutines();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadWeekRoutines();
  }

  applyFilter(): void {
    this.page = 0;
    this.loadWeekRoutines();
  }

  resetTable(): void {
    this.search = '';
    this.page = 0;
    this.loadWeekRoutines();
  }

  addWeekRoutines(): void {
    const dialogRef = this.dialog.open(AddWeekRoutineComponent, {
      width: '400px',
    });
    dialogRef.afterClosed();
  }

  async editWeekRoutine(weekRoutine: WeekRoutineModel) {
    await this.routerService.goToEditWeekRoutine(weekRoutine._id);
  }

  deleteWeekRoutine(weekRoutine: WeekRoutineModel) {
    this.dialogService
      .openConfirmDialog(
        'Eliminar rutina semanal',
        'Seguro que quieres eliminar ' + weekRoutine.title + '?'
      )
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.weekRoutinesService
            .remove(weekRoutine._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: (res) => {
                this.snackerService.showSuccessful('Rutina semanal eliminada con éxito');
                this.loadWeekRoutines();
              },
              error: (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              },
            });
        }
      });
  }

  openInfoWeekRoutine(weekRoutine: WeekRoutineModel) {}
}
