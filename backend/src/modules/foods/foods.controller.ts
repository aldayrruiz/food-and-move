import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { FindFoodDto } from './dto/find-food.dto';
import { FoodDto } from './dto/food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodsService } from './foods.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post('create')
  async create(@Body() foodDto: FoodDto) {
    return await this.foodsService.create(foodDto);
  }

  @Get('findAll')
  async findAll() {
    return await this.foodsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.foodsService.findOne(id);
  }

  @Post('find')
  async find(@Body() findFoodDto: FindFoodDto) {
    return await this.foodsService.find(findFoodDto);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return await this.foodsService.update(id, updateFoodDto);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.foodsService.remove(id);
  }

  @Post('findByPatient/:id')
  async findByPatient(@Param('id') id: string, @Body() dateRangeDto: DateRangeDto) {
    return await this.foodsService.findByPatient(id, dateRangeDto);
  }

  @Post('findIngredients/:id')
  async findIngredients(@Param('id') id: string, @Body() dateRangeDto: DateRangeDto) {
    return await this.foodsService.findIngredients(id, dateRangeDto);
  }

  @Get('checkIngredient/:id/:name')
  async checkIngredient(@Param('id') id: string, @Param('name') name: string) {
    return await this.foodsService.setCheckIngredient(id, name, true, true);
  }

  @Get('importDiet/:dietId/:patientId/:date')
  async importDiet(@Param('dietId') dietId, @Param('patientId') patientId, @Param('date') date: Date) {
    return await this.foodsService.importDiet(dietId, patientId, date);
  }

  @Get('lastAssigned/:patientId')
  async lastFoodsAssigned(@Param('patientId') patientId: string, @Query('limitDate') limitDate: string) {
    return await this.foodsService.lastFoodsAssigned(patientId, limitDate);
  }
}
