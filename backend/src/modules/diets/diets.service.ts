import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { DayOfWeek } from 'src/shared/enums/day-of-week';
import { RecipeDto } from '../recipes/dto/recipe.dto';
import { UpdateRecipeDto } from '../recipes/dto/update-recipe.dto';
import { DietDto } from './dto/diet.dto';
import { FilterDietDto } from './dto/filter-diet.dto';
import { QueryDietDto } from './dto/query-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { DietDocument } from './schemas/diet.schemas';

@Injectable()
export class DietsService {
  constructor(
    @Inject(CustomQueryService) private readonly customQueryService: CustomQueryService,
    @InjectModel('diets') private readonly dietsModel: Model<DietDocument>
  ) {}

  async findOne(id: string) {
    const diet = await this.dietsModel.findById(id);
    if (!diet) throw new NotFoundException('No se ha encontrado la dieta');
    return diet;
  }

  async lookUp(filter: FilterDietDto) {
    const diet = await this.dietsModel.findOne(filter);
    if (!diet) throw new NotFoundException('No se ha encontrado ninguna dieta');
    return diet;
  }

  async filter(queryDietDto: QueryDietDto) {
    return await this.customQueryService.filter(queryDietDto, this.dietsModel);
  }

  async create(dietDto: DietDto) {
    const diet = await this.dietsModel.create(dietDto);
    return diet;
  }

  async update(id: string, updateDietDto: UpdateDietDto) {
    const updatedDiet = await this.dietsModel.findByIdAndUpdate(id, updateDietDto, { new: true });
    if (!updatedDiet) throw new NotFoundException('No se ha encontrado la dieta');
    return updatedDiet;
  }

  async remove(id: string) {
    const deletedDiet = await this.dietsModel.findByIdAndDelete(id);
    if (!deletedDiet) throw new NotFoundException('No se ha encontrado la dieta');
    return deletedDiet;
  }

  getDayItems(day: DayOfWeek, diet: any) {
    switch (day) {
      case DayOfWeek.Lunes:
        return diet.monday;
      case DayOfWeek.Martes:
        return diet.tuesday;
      case DayOfWeek.Miercoles:
        return diet.wednesday;
      case DayOfWeek.Jueves:
        return diet.thursday;
      case DayOfWeek.Viernes:
        return diet.friday;
      case DayOfWeek.Sabado:
        return diet.saturday;
      case DayOfWeek.Domingo:
        return diet.sunday;
      default:
        return [];
    }
  }

  getUpdateDayItems(day: DayOfWeek, items: any) {
    switch (day) {
      case DayOfWeek.Lunes:
        return { monday: items };
      case DayOfWeek.Martes:
        return { tuesday: items };
      case DayOfWeek.Miercoles:
        return { wednesday: items };
      case DayOfWeek.Jueves:
        return { thursday: items };
      case DayOfWeek.Viernes:
        return { friday: items };
      case DayOfWeek.Sabado:
        return { saturday: items };
      case DayOfWeek.Domingo:
        return { sunday: items };
      default:
        return {};
    }
  }

  async getRecipe(dietId: string, day: DayOfWeek, recipeId: string) {
    const diet = await this.dietsModel.findById(dietId);
    if (!diet) throw new NotFoundException('No se ha encontrado la dieta');
    const dayItems = this.getDayItems(day, diet);
    const index = dayItems.findIndex((recipe) => recipe._id == recipeId);
    if (index == -1) throw new NotFoundException('No se ha encontrado la receta');
    return dayItems[index];
  }

  async addRecipe(dietId: string, day: DayOfWeek, recipe: RecipeDto) {
    const diet = await this.dietsModel.findById(dietId);
    if (!diet) throw new NotFoundException('No se ha encontrado la dieta');
    const dayItems = this.getDayItems(day, diet);
    dayItems.push(recipe);
    const update = this.getUpdateDayItems(day, dayItems);
    return await this.dietsModel.findByIdAndUpdate(dietId, update, { new: true });
  }

  async updateRecipe(
    dietId: string,
    day: DayOfWeek,
    recipeId: string,
    updateRecipe: UpdateRecipeDto
  ) {
    const diet = await this.dietsModel.findById(dietId);
    if (!diet) throw new NotFoundException('No se ha encontrado la dieta');
    const dayItems = this.getDayItems(day, diet);
    const index = dayItems.findIndex((recipe) => recipe._id == recipeId);
    if (index == -1) throw new NotFoundException('No se ha encontrado la receta');
    dayItems[index] = {
      ...dayItems[index],
      ...updateRecipe,
    };
    const update = this.getUpdateDayItems(day, dayItems);
    return await this.dietsModel.findByIdAndUpdate(dietId, update, { new: true });
  }

  async removeRecipe(dietId: string, day: DayOfWeek, recipeId: string) {
    const diet = await this.dietsModel.findById(dietId);
    if (!diet) throw new NotFoundException('No se ha encontrado la dieta');
    const dayItems = this.getDayItems(day, diet);
    const index = dayItems.findIndex((recipe) => recipe._id == recipeId);
    if (index !== -1) {
      dayItems.splice(index, 1);
      const update = this.getUpdateDayItems(day, dayItems);
      return await this.dietsModel.findByIdAndUpdate(dietId, update, { new: true });
    } else {
      return diet;
    }
  }
}
