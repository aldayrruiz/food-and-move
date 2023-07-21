import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { RecipesService } from '@core/services/api/recipes.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { InfoRecipeComponent } from '@modules/recipes/components/info-recipe/info-recipe.component';
import { TableStructure } from '@shared/components/table/interfaces/table-structure';
import { finalize } from 'rxjs/operators';
import { DEFAULT_LIMIT } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-recipes-page',
  templateUrl: './recipes-page.component.html',
  styleUrls: ['./recipes-page.component.css', '../../../../../assets/styles/crud.css'],
})
export class RecipesPageComponent implements OnInit {
  listRecipes: RecipeModel[] = [];
  isSmall = false;
  isLoadingResults = false;

  dataSource!: MatTableDataSource<any>;

  tableStructure: TableStructure[] = [
    { index: 1, field: 'title', header: 'Título', sort: true },
    { index: 2, field: 'meal', header: 'Tipo de Comida', sort: true },
    { index: 3, field: 'dish', header: 'Plato', sort: true },
    { index: 4, field: 'description', header: 'Descripción', sort: true },
  ];
  indexDisplay = 4;

  search = '';
  searchFields: string[] = ['title', 'meal', 'dish'];

  sortField = 'title';
  sortDirection = 'asc';

  limit: number = DEFAULT_LIMIT;
  total = 0;
  page = 0;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog,
    private readonly recipesService: RecipesService,
    private readonly dialogService: DialogService,
    private readonly routerService: RouterService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoadingResults = true;
    this.recipesService
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
          this.listRecipes = [...res.items];
          this.dataSource = new MatTableDataSource(this.listRecipes);
        },
        error: (err) => console.log(err),
      });
  }

  changeSort(sort: Sort) {
    this.sortDirection = sort.direction;
    this.sortField = sort.active;
    this.page = 0;
    this.loadRecipes();
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex;
    this.loadRecipes();
  }

  applyFilter(): void {
    this.page = 0;
    this.loadRecipes();
  }

  resetTable(): void {
    this.search = '';
    this.page = 0;
    this.loadRecipes();
  }

  addRecipe(): void {
    this.routerService.goToAddRecipe();
  }

  editRecipe(recipe: RecipeModel): void {
    this.routerService.goToEditRecipe(recipe._id);
  }

  deleteRecipe(recipe: RecipeModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar receta', 'Seguro que quieres eliminar ' + recipe.title + '?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.recipesService
            .removeRecipe(recipe._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: () => {
                this.snackerService.showSuccessful('Receta eliminada con éxito');
                this.loadRecipes();
              },
              error: (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              },
            });
        }
      });
  }

  openInfoRecipe(recipe: RecipeModel): void {
    const dialogRef = this.dialog.open(InfoRecipeComponent, {
      width: '800px',
      data: recipe,
    });
    dialogRef.afterClosed();
  }
}
