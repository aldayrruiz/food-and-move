import { Pipe, PipeTransform } from '@angular/core';
import { Dish } from '@core/enums/dish';
import { Meal } from '@core/enums/meal';

@Pipe({
  name: 'foodSort',
})
export class FoodSortPipe implements PipeTransform {
  transform<T extends { meal: Meal; dish: Dish }>(foods: Array<T>): Array<T> {
    const cpy = [...foods];
    return cpy.sort((a, b) => this.sort(a, b));
  }

  sort<T extends { meal: Meal; dish: Dish }>(a: T, b: T): number {
    const mealA: number = this.getPointsMeal(a.meal);
    const mealB: number = this.getPointsMeal(b.meal);
    if (mealA < mealB) {
      return -1;
    } else if (mealA > mealB) {
      return 1;
    } else {
      const dishA: number = this.getPointsDish(a.dish);
      const dishB: number = this.getPointsDish(b.dish);
      if (dishA < dishB) {
        return -1;
      } else if (dishA > dishB) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  getPointsMeal(meal: Meal): number {
    switch (meal) {
      case Meal.Desayuno:
        return 0;
      case Meal.Almuerzo:
        return 1;
      case Meal.Merienda:
        return 2;
      case Meal.Cena:
        return 3;
      default:
        return 4;
    }
  }

  getPointsDish(dish: Dish): number {
    switch (dish) {
      case Dish.Principal:
        return 0;
      case Dish.Primero:
        return 1;
      case Dish.Segundo:
        return 2;
      case Dish.Postre:
        return 3;
      default:
        return 4;
    }
  }
}
