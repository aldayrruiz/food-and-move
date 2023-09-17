import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { FilterRecipeDto } from './dto/filter-recipe.dto';
import { QueryRecipeDto } from './dto/query-recipe.dto';
import { RecipeDto } from './dto/recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';
import {Roles} from "@modules/auth/roles.decorator";
import {Role} from "@modules/auth/enums/role.enum";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.recipesService.findOne(id);
  }

  @Post('lookUp')
  async lookUp(@Body() filterRecipeDto: FilterRecipeDto) {
    return await this.recipesService.lookUp(filterRecipeDto);
  }

  @Post('filter')
  async filter(@Body() queryRecipeDto: QueryRecipeDto) {
    return await this.recipesService.filter(queryRecipeDto);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() recipeDto: RecipeDto) {
    return await this.recipesService.create(recipeDto);
  }

  @Roles(Role.Admin)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return await this.recipesService.update(id, updateRecipeDto);
  }

  @Roles(Role.Admin)
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.recipesService.remove(id);
  }
}
