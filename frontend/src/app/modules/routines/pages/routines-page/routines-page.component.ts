import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoutineModel } from '@core/models/routine.model';
import { DialogService } from '@core/services/dialog.service';
import { LoaderService } from '@core/services/loader.service';
import { RouterService } from '@core/services/router.service';
import { RoutinesService } from '@core/services/routines.service';
import { SnackerService } from '@core/services/snacker.service';
import { InfoRoutineComponent } from '@modules/routines/components/info-routine/info-routine.component';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs/operators';
import { DEFAULT_LIMIT } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-routines-page',
  templateUrl: './routines-page.component.html',
  styleUrls: ['./routines-page.component.css', '../../../../../assets/styles/crud.css'],
})
export class RoutinesPageComponent implements OnInit {
  listRoutines: RoutineModel[] = [];
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
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog,
    private readonly dialogService: DialogService,
    private readonly routinesService: RoutinesService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.loadRoutines();
    this.setColumnsBySize();
  }

  loadRoutines(): void {
    this.isLoadingResults = true;
    this.routinesService
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
      .subscribe(
        (res) => {
          this.total = res.total;
          this.listRoutines = [...res.items];
          this.dataSource = new MatTableDataSource(this.listRoutines);
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
    this.breakpointObserver.observe(['(max-width: 550px)']).subscribe((result) => {
      if (result.matches) {
        this.indexDisplay = 1;
      }
    });
    this.breakpointObserver.observe(['(min-width: 901px)']).subscribe((result) => {
      if (result.matches) {
        this.indexDisplay = 2;
      }
    });
  }

  changeSort(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortField = sort.active;
    this.page = 0;
    this.loadRoutines();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadRoutines();
  }

  applyFilter(): void {
    this.page = 0;
    this.loadRoutines();
  }

  resetTable(): void {
    this.search = '';
    this.page = 0;
    this.loadRoutines();
  }

  addRoutine(): void {
    this.routerService.goToAddRoutine();
  }

  editRoutine(routine: RoutineModel) {
    this.routerService.goToEditRoutine(routine._id);
  }

  deleteRoutine(routine: RoutineModel) {
    this.dialogService
      .openConfirmDialog('Eliminar rutina', 'Seguro que quieres eliminar ' + routine.title + '?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.routinesService
            .removeRoutine(routine._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Rutina eliminada con éxito');
                this.loadRoutines();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              }
            );
        }
      });
  }

  openInfoRoutine(routine: RoutineModel) {
    const dialogRef = this.dialog.open(InfoRoutineComponent, {
      width: '800px',
      data: routine,
    });
    dialogRef.afterClosed();
  }
}
