import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { Model } from 'mongoose';
import { addDay, getDateRange } from 'src/utils/date-utils';
import { getQueryDate } from 'src/utils/filter-dates.utils';
import { asyncForEach } from 'src/utils/utils';
import { DietsService } from '../diets/diets.service';
import { FindFoodDto } from './dto/find-food.dto';
import { FoodDto } from './dto/food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodDocument } from './schemas/food.schemas';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel('foods') private readonly foodModel: Model<FoodDocument>,
    @Inject(DietsService) private readonly dietsService: DietsService
  ) {}

  async create(foodDto: FoodDto) {
    const food = await this.foodModel.create(foodDto);
    return food;
  }

  async findAll() {
    const foods = await this.foodModel.find({});
    return foods;
  }

  async findOne(id: string) {
    const food = await this.foodModel.findById(id);
    if (!food) throw new NotFoundException('No se ha encontrado la comida');
    return food;
  }

  async find(findFoodDto: FindFoodDto) {
    const foods = await this.foodModel.find(findFoodDto);
    return foods;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto) {
    const updatedFood = await this.foodModel.findByIdAndUpdate(id, updateFoodDto, { new: true });
    if (!updatedFood) throw new NotFoundException('No se ha encontrado la comida');
    return updatedFood;
  }

  async remove(id: string) {
    const deletedFood = await this.foodModel.findByIdAndDelete(id);
    if (!deletedFood) throw new NotFoundException('No se ha encontrado la comida');
    return deletedFood;
  }

  async removeByPatient(idPatient: string) {
    const foods = await this.foodModel.find({ patient: idPatient });
    foods.forEach(async (food) => {
      await this.foodModel.findByIdAndRemove(food._id);
    });
  }

  async findByPatient(idPatient: string, dateRangeDto: DateRangeDto) {
    const foods = await this.foodModel.find(getQueryDate({ patient: idPatient }, dateRangeDto, 'date'));
    return foods;
  }

  async findIngredients(idPatient: string, dateRangeDto: DateRangeDto) {
    const foods = await this.findByPatient(idPatient, dateRangeDto);
    let ingredients = [];
    foods.forEach((food) => {
      ingredients = [
        ...ingredients,
        ...food.ingredients.map((ingredient) => {
          return {
            title: food.title,
            food: food._id,
            date: food.date,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            isChecked: ingredient.isChecked ? ingredient.isChecked : false,
          };
        }),
      ];
    });
    return ingredients;
  }

  async setCheckIngredient(idFood: string, nameIngredient: string, isChecked: boolean, change = false) {
    const food = await this.findOne(idFood);
    const ingredients = food.ingredients.map((ingredient) => {
      if (ingredient.name == nameIngredient) ingredient.isChecked = change ? !ingredient.isChecked : isChecked;
      return ingredient;
    });
    return await this.update(idFood, { ingredients });
  }

  async importDiet(dietId: string, patientId: string, date: Date) {
    const diet = await this.dietsService.findOne(dietId);
    const range = getDateRange(date);
    let indexDate = new Date(date);
    let itemsDay = [];
    for (let i = 0; i < 7; i++) {
      indexDate = addDay(range.startDate, i);
      switch (i) {
        case 0: {
          itemsDay = [...diet.monday];
          break;
        }
        case 1: {
          itemsDay = [...diet.tuesday];
          break;
        }
        case 2: {
          itemsDay = [...diet.wednesday];
          break;
        }
        case 3: {
          itemsDay = [...diet.thursday];
          break;
        }
        case 4: {
          itemsDay = [...diet.friday];
          break;
        }
        case 5: {
          itemsDay = [...diet.saturday];
          break;
        }
        case 6: {
          itemsDay = [...diet.sunday];
          break;
        }
      }
      await asyncForEach(itemsDay, async (recipe) => {
        const food = {
          title: recipe.title,
          description: recipe.description,
          meal: recipe.meal,
          dish: recipe.dish,
          links: recipe.links,
          ingredients: recipe.ingredients,
          patient: patientId,
          comments: '',
          date: indexDate,
        };
        await this.create(food as FoodDto);
      });
    }
    return await this.findByPatient(patientId, range);
  }

  async clearFoods(patientId: string, date: DateRangeDto) {
    const foods = await this.findByPatient(patientId, date);
    foods.forEach(async (food) => {
      await this.remove(food._id);
    });
  }

  async lastFoodsAssigned(patientId: string, limitDate: string) {
    const lastFoodAssigned = await this.foodModel
      .findOne({
        patient: patientId,
        date: { $lt: limitDate },
      })
      .sort({ date: -1 })
      .exec();
    const range = getDateRange(lastFoodAssigned.date);
    return await this.findByPatient(patientId, range);
  }
}
