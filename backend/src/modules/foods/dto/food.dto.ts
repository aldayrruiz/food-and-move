import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { RecipeDto } from 'src/modules/recipes/dto/recipe.dto';
import { Rating } from 'src/shared/enums/rating';

export class FoodDto extends RecipeDto {
  @ApiProperty()
  @IsObjectId()
  @IsNotEmpty()
  patient: string;

  @ApiProperty()
  @IsString()
  @MaxLength(155, { message: 'Comentario no valido, demasiado largo' })
  @IsOptional()
  comments: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  done: boolean;

  @ApiProperty({ enum: Rating })
  @IsEnum(Rating)
  @IsOptional()
  rating: Rating;
}
