import { Pipe, PipeTransform } from '@angular/core';
import { Meal } from '@core/enums/meal';

@Pipe({
  name: 'foodIcon',
})
export class FoodIconPipe implements PipeTransform {
  transform(meal: Meal): string {
    switch (meal) {
      case Meal.Desayuno:
        return 'coffee';
      case Meal.Almuerzo:
        return 'restaurant';
      case Meal.Merienda:
        return 'kitchen';
      case Meal.Cena:
        return 'fastfood';
      default:
        return 'restaurant';
    }
  }
}
