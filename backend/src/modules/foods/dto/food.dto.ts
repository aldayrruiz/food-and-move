import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@shared/enums/rating';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { RecipeDto } from 'src/modules/recipes/dto/recipe.dto';

export class FoodDto extends RecipeDto {
  @IsObjectId()
  @IsNotEmpty()
  patient: string;

  @IsString()
  @MaxLength(155, { message: 'Comentario no valido, demasiado largo' })
  @IsOptional()
  comments: string;

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
