import { PartialType } from '@nestjs/swagger';
import { FoodDto } from './food.dto';

export class UpdateFoodDto extends PartialType(FoodDto) {}
