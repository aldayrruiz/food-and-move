import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DateRange } from '@core/interfaces/date-range';
import { ConsultModel } from '@core/models/consult/consult.model';
import { DietModel } from '@core/models/diet/diet';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { FoodModel } from '@core/models/food/food.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { ConsultsService } from '@core/services/api/consults.service';
import { FoodsService } from '@core/services/api/foods.service';
import { DialogService } from '@core/services/gui/dialog.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { StorageService } from '@core/services/storage.service';
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
  consult!: ConsultModel;
  employee!: EmployeeModel;
  patient!: PatientModel;

  days: Day[] = daysInit;
  weeklyCalendarType = WeeklyCalendarType;
  dateRange: DateRange = getDateRange(new Date());

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly foodsService: FoodsService,
    private readonly routerService: RouterService,
    private readonly snackerService: SnackerService,
    private readonly loaderService: LoaderService,
    private readonly dialogService: DialogService,
    private readonly consultsService: ConsultsService,
    private readonly dialog: MatDialog,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['date']) {
      this.dateRange = getDateRange(new Date(params['date']));
    }
    this.initPatient();
    this.initEmployee();
    this.loadFoods();
    this.initLastConsult();
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
        this.setFoods([]);
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
      data: { showCustom: false, type: ImportType.Diet },
    });
    dialogRef.afterClosed().subscribe({
      next: (diet: DietModel) => {
        if (diet) {
          this.clearFoods();
          this.loadDiet(diet);
          this.setDietToLastConsult(diet._id);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private clearFoods() {
    this.loaderService.isLoading.next(true);
    this.foodsService
      .clearFoods(this.patient!._id, this.dateRange)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe();
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

  private setDietToLastConsult(dietId: string) {
    this.consultsService.updateConsult(this.consult._id, { diet: dietId }).subscribe({
      next: () => {},
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

  private initEmployee() {
    this.employee = this.storageService.getUser();
  }

  private initLastConsult() {
    this.consultsService.getLastConsult(this.patient._id, this.employee._id).subscribe({
      next: (res) => {
        this.consult = res;
      },
    });
  }
}
