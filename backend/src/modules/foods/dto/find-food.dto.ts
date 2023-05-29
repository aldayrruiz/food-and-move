import { PartialType } from '@nestjs/swagger';
import { FoodDto } from './food.dto';

export class FindFoodDto extends PartialType(FoodDto) {}
