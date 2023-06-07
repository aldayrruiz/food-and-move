import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DayOfWeek } from '@shared/enums/day-of-week';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RecipeDto } from '../recipes/dto/recipe.dto';
import { UpdateRecipeDto } from '../recipes/dto/update-recipe.dto';
import { DietsService } from './diets.service';
import { DietDto } from './dto/diet.dto';
import { FilterDietDto } from './dto/filter-diet.dto';
import { QueryDietDto } from './dto/query-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('diets')
@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dietsService.findOne(id);
  }

  @Post('lookUp')
  async lookUp(@Body() filterDietDto: FilterDietDto) {
    return await this.dietsService.lookUp(filterDietDto);
  }

  @Post('filter')
  async filter(@Body() queryDietDto: QueryDietDto) {
    return await this.dietsService.filter(queryDietDto);
  }

  @Post('create')
  async create(@Body() dietDto: DietDto) {
    return await this.dietsService.create(dietDto);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
    return await this.dietsService.update(id, updateDietDto);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.dietsService.remove(id);
  }

  @Get('getRecipe/:dietId/:day/:recipeId')
  async getRecipe(@Param('dietId') dietId: string, @Param('day') day: DayOfWeek, @Param('recipeId') recipeId: string) {
    return await this.dietsService.getRecipe(dietId, day, recipeId);
  }

  @Post('addRecipe/:dietId/:day')
  async addRecipe(@Param('dietId') dietId: string, @Param('day') day: DayOfWeek, @Body() recipeDto: RecipeDto) {
    return await this.dietsService.addRecipe(dietId, day, recipeDto);
  }

  @Patch('updateRecipe/:dietId/:day/:recipeId')
  async updateRecipe(
    @Param('dietId') dietId: string,
    @Param('day') day: DayOfWeek,
    @Param('recipeId') recipeId: string,
    @Body() updateRecipeDto: UpdateRecipeDto
  ) {
    return await this.dietsService.updateRecipe(dietId, day, recipeId, updateRecipeDto);
  }

  @Delete('removeRecipe/:dietId/:day/:recipeId')
  async removeRecipe(@Param('dietId') dietId: string, @Param('day') day: DayOfWeek, @Param('recipeId') recipeId: string) {
    return await this.dietsService.removeRecipe(dietId, day, recipeId);
  }
}
