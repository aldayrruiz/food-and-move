import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Meal } from 'src/shared/enums/meal';
import { Dish } from '../../../shared/enums/dish';

class Ingredient {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  unit: string;
}

export class RecipeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Título no valido, demasiado largo' })
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(155, { message: 'Descripción no valido, demasiado largo' })
  @IsOptional()
  description: string;

  @ApiProperty({ enum: Meal, default: Meal.Almuerzo })
  @IsEnum(Meal)
  meal: Meal;

  @ApiProperty({ enum: Dish, default: Dish.Primero })
  @IsEnum(Dish)
  dish: Dish;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @Type(() => String)
  links: string[];

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @Type(() => String)
  videos: string[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => Ingredient)
  ingredients: Ingredient[];

  @ApiProperty()
  @IsObjectId()
  @IsOptional()
  attachment: string;
}
