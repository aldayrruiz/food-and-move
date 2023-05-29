import { Pipe, PipeTransform } from '@angular/core';
import { FoodModel } from '../../core/models/food.model';

@Pipe({
  name: 'food',
})
export class FoodPipe implements PipeTransform {
  transform(food: FoodModel): FoodModel {
    try {
      let newFood: FoodModel = Object.assign({}, food);
      if (food.date != undefined) newFood.date = new Date(food.date);
      return newFood;
    } catch (e) {
      console.log(e);
      return food;
    }
  }
}
