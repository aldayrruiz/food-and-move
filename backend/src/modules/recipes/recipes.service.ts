import { Recipe, RecipeDocument } from '@modules/recipes/schemas/recipe.schema';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { FilterRecipeDto } from './dto/filter-recipe.dto';
import { QueryRecipeDto } from './dto/query-recipe.dto';
import { RecipeDto } from './dto/recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @Inject(CustomQueryService) private readonly customQueryService: CustomQueryService,
    @InjectModel(Recipe.name) private readonly recipeModel: Model<RecipeDocument>
  ) {}

  async findOne(id: string) {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe) throw new NotFoundException('No se ha encontrado la receta');
    return recipe;
  }

  async lookUp(filter: FilterRecipeDto) {
    const recipe = await this.recipeModel.findOne(filter);
    if (!recipe) throw new NotFoundException('No se ha encontrado ningún resultado');
    return recipe;
  }

  async filter(queryRecipeDto: QueryRecipeDto) {
    console.log(queryRecipeDto);
    return await this.customQueryService.filter(queryRecipeDto, this.recipeModel);
  }

  async create(recipeDto: RecipeDto) {
    const recipe = await this.recipeModel.create(recipeDto);
    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(id, updateRecipeDto, {
      new: true,
    });
    if (!updatedRecipe) throw new NotFoundException('No se ha encontrado la receta');
    return updatedRecipe;
  }

  async remove(id: string) {
    const deletedRecipe = await this.recipeModel.findByIdAndDelete(id);
    if (!deletedRecipe) throw new NotFoundException('No se ha encontrado la receta');
    return deletedRecipe;
  }
}
