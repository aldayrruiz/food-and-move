import { Pipe, PipeTransform } from '@angular/core';
import { Meal } from '@core/enums/meal';

@Pipe({
  name: 'foodBackground',
})
export class FoodBackgroundPipe implements PipeTransform {
  transform(meal: Meal): string {
    switch (meal) {
      case Meal.Desayuno:
        return 'rgba(255,0,0,0.2)';
      case Meal.Almuerzo:
        return 'rgba(0,255,0,0.2)';
      case Meal.Merienda:
        return 'rgba(255,255,0,0.2)';
      case Meal.Cena:
        return 'rgba(0,0,255,0.2)';
      default:
        return 'rgba(0,0,0,0)';
    }
  }
}
