import { Dish } from '@shared/enums/dish';
import { Meal } from '@shared/enums/meal';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';

export class Ingredient {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsBoolean()
  @IsOptional()
  isChecked: boolean;
}

export class RecipeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Título no valido, demasiado largo' })
  title: string;

  @IsString()
  @MaxLength(155, { message: 'Descripción no valido, demasiado largo' })
  @IsOptional()
  description?: string;

  @IsEnum(Meal)
  meal: Meal;

  @IsEnum(Dish)
  dish: Dish;

  @IsArray()
  @Type(() => String)
  links: string[];

  @IsArray()
  @Type(() => String)
  videos: string[];

  @ValidateNested({ each: true })
  @Type(() => Ingredient)
  ingredients: Ingredient[];

  @IsMongoId()
  @IsOptional()
  attachment?: string;
}
