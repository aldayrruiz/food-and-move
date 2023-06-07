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
import { finalize } from 'rxjs/operators';

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
    const patientId = params['patientId'];
    if (params['date']) {
      this.dateRange = getDateRange(new Date(params['date']));
    }
    this.patientsService.getPatient(patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loadFoods();
      },
    });
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
            .subscribe(
              (res) => {
                this.snackerService.showSuccessful('Comida eliminada con éxito');
                this.loadFoods();
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error.message);
              }
            );
        }
      });
  }

  importDiet(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: ImportType.Diet,
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          const diet = res as DietModel;
          this.loaderService.isLoading.next(true);
          this.foodsService
            .importDiet(diet._id, this.patient!._id, this.dateRange.startDate!)
            .pipe(finalize(() => this.loaderService.isLoading.next(false)))
            .subscribe(
              (res) => {
                this.setFoods(res);
                this.snackerService.showSuccessful('Dieta importada con éxito.');
              },
              (err) => {
                console.log(err);
                this.snackerService.showError(err.error);
              }
            );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
