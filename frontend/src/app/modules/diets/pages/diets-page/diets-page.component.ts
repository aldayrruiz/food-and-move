import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DietModel } from '@core/models/diet/diet';
import { DialogService } from '@core/services/dialog.service';
import { DietsService } from '@core/services/diets.service';
import { LoaderService } from '@core/services/loader.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { AddDietComponent } from '@modules/diets/components/add-diet/add-diet.component';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs';
import { DEFAULT_LIMIT } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-diets-page',
  templateUrl: './diets-page.component.html',
  styleUrls: ['./diets-page.component.css', '../../../../../assets/styles/crud.css'],
})
export class DietsPageComponent implements OnInit {
  listDiets: DietModel[] = [];
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
    private readonly dietsService: DietsService,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.loadDiets();
    this.setColumnsBySize();
  }

  loadDiets(): void {
    this.isLoadingResults = true;
    this.dietsService
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
          this.listDiets = [...res.items];
          this.dataSource = new MatTableDataSource(this.listDiets);
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
    this.loadDiets();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadDiets();
  }

  applyFilter(): void {
    this.page = 0;
    this.loadDiets();
  }

  resetTable(): void {
    this.search = '';
    this.page = 0;
    this.loadDiets();
  }

  addDiet(): void {
    const dialogRef = this.dialog.open(AddDietComponent, {
      width: '400px',
    });
    dialogRef.afterClosed();
  }

  editDiet(diet: DietModel) {
    this.routerService.goToEditDiet(diet._id);
  }

  deleteDiet(diet: DietModel) {
    this.dialogService
      .openConfirmDialog(
        'Eliminar dieta semanal',
        'Seguro que quieres eliminar ' + diet.title + '?'
      )
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.dietsService
            .removeDiet(diet._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Dieta semanal eliminada con éxito');
                this.loadDiets();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              }
            );
        }
      });
  }

  openInfoDiet(diet: DietModel) {}
}
