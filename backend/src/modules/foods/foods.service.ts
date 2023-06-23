import { Diet } from '@modules/diets/schemas/diet.schema';
import { Recipe } from '@modules/recipes/schemas/recipe.schema';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { Model } from 'mongoose';
import { addDay, getDateRange } from 'src/utils/date-utils';
import { getQueryDate } from 'src/utils/filter-dates.utils';
import { DietsService } from '../diets/diets.service';
import { FindFoodDto } from './dto/find-food.dto';
import { FoodDto } from './dto/food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food, FoodDocument } from './schemas/food.schema';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food.name) private readonly foodModel: Model<FoodDocument>,
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
    const diet: Diet = await this.dietsService.findOne(dietId);
    const dateRange: { startDate: Date; endDate: Date } = getDateRange(date);

    for (let i: number = 0; i < 7; i++) {
      const day: Date = addDay(dateRange.startDate, i);
      const recipes: Recipe[] = this.getRecipesFromDietByIndexDay(diet, i);
      await this.createFoodsForPatient(recipes, patientId, day);
    }
    return await this.findByPatient(patientId, dateRange);
  }

  getRecipesFromDietByIndexDay(diet: Diet, indexDay: number): Recipe[] {
    const recipesByIndex = {
      0: diet.monday,
      1: diet.tuesday,
      2: diet.wednesday,
      3: diet.thursday,
      4: diet.friday,
      5: diet.saturday,
      6: diet.sunday,
    };
    return recipesByIndex[indexDay];
  }

  async createFoodsForPatient(recipes: Recipe[], patientId: string, date: Date) {
    if (recipes.length == 0) return;
    for (const recipe of recipes) {
      // Do not use "...recipe" because it is a mongoose object (not dto)
      const food = {
        title: recipe.title,
        description: recipe.description,
        meal: recipe.meal,
        dish: recipe.dish,
        links: recipe.links,
        videos: recipe.videos,
        ingredients: recipe.ingredients,
        attachment: recipe.attachment,
        patient: patientId,
        comments: '',
        date,
      };
      // @ts-ignore
      await this.create(food as FoodDto);
    }
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
