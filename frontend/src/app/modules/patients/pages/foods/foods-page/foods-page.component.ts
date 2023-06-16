import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DateRange } from '@core/interfaces/date-range';
import { DietModel } from '@core/models/diet';
import { FoodModel } from '@core/models/food.model';
import { PatientModel } from '@core/models/patient.model';
import { DialogService } from '@core/services/dialog.service';
import { FoodsService } from '@core/services/foods.service';
import { LoaderService } from '@core/services/loader.service';
import { PatientsService } from '@core/services/patients.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { addDay, getDateRange, getDay } from '@core/utils/date-utils';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
import { daysInit } from '@shared/components/weekly-calendar/constant/days-init';
import { WeeklyCalendarType } from '@shared/components/weekly-calendar/enums/weekly-calendar-type';
import { Day } from '@shared/components/weekly-calendar/interfaces/day';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-foods-page',
  templateUrl: './foods-page.component.html',
  styleUrls: ['./foods-page.component.css'],
})
export class FoodsPageComponent implements OnInit {
  days: Day[] = daysInit;
  weeklyCalendarType = WeeklyCalendarType;

  patient!: PatientModel;
  dateRange: DateRange = getDateRange(new Date());

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly foodsService: FoodsService,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly dialog: MatDialog,
    private readonly patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['date']) {
      this.dateRange = getDateRange(new Date(params['date']));
    }
    this.initPatient();
    this.loadFoods();
  }

  changeDateRange(nWeeks: number): void {
    const date = addDay(this.dateRange.startDate, 7 * nWeeks);
    this.dateRange = getDateRange(date);
    this.loadFoods();
  }

  loadFoods(): void {
    this.loaderService.isLoading.next(true);
    this.foodsService
      .getFoods(this.patient?._id, this.dateRange)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: (res) => {
          if (res.length === 0) {
            this.loadLastAssignedFoods();
          } else {
            this.setFoods(res);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadLastAssignedFoods(): void {
    const limitDate = this.dateRange.startDate.toJSON();
    this.foodsService.getLastAssignedFoods(this.patient?._id, limitDate).subscribe({
      next: (res) => {
        this.setFoods(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  setFoods(foods: FoodModel[]): void {
    this.days.forEach((_, i) => {
      this.days[i].items = foods.filter((foodItem) => {
        return getDay(foodItem.date) - 1 == i;
      });
      this.days[i].date = addDay(this.dateRange.startDate, i);
    });
  }

  async addFood(date: Date) {
    await this.routerService.goToAddFood(this.patient._id, date);
  }

  async editFood(food: FoodModel) {
    console.log(`Edit food ${food._id}`);
    await this.routerService.goToEditFood(this.patient._id, food._id);
  }

  deleteFood(food: FoodModel): void {
    this.dialogService
      .openConfirmDialog('Eliminar comida', 'Seguro que quieres eliminar la comida?')
      .subscribe((res) => {
        if (res) {
          this.loaderService.isLoading.next(true);
          this.foodsService
            .removeFood(food._id)
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe({
              next: () => {
                this.snackerService.showSuccessful('Comida eliminada con éxito');
                this.loadFoods();
              },
              error: (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              },
            });
        }
      });
  }

  importDiet(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: ImportType.Diet,
    });
    dialogRef.afterClosed().subscribe({
      next: (diet: DietModel) => {
        if (diet) {
          this.clearFoods();
          this.loadDiet(diet);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private initPatient() {
    this.activatedRoute.data.subscribe((data) => {
      this.patient = data['patient'];
    });
  }

  private loadDiet(diet: DietModel) {
    this.loaderService.isLoading.next(true);
    this.foodsService
      .importDiet(diet._id, this.patient!._id, this.dateRange.startDate!)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe({
        next: (res) => {
          this.setFoods(res);
          this.snackerService.showSuccessful('Dieta importada con éxito.');
        },
        error: (err) => {
          console.log(err);
          this.snackerService.showError(err.error);
        },
      });
  }

  private clearFoods() {
    this.loaderService.isLoading.next(false);
    this.foodsService
      .clearFoods(this.patient!._id, this.dateRange)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe();
  }
}
