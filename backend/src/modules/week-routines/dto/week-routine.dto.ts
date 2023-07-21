import { RecipeDto } from '@modules/recipes/dto/recipe.dto';
import { RoutineDto } from '@modules/routines/dto/routine.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class WeekRoutineDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Título no valido, demasiado largo' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(155, { message: 'Descripción no valida, demasiado largo' })
  description: string;

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  monday: RecipeDto[];

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  tuesday: RecipeDto[];

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  wednesday: RecipeDto[];

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  thursday: RecipeDto[];

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  friday: RecipeDto[];

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  saturday: RecipeDto[];

  @ApiProperty({ type: [RoutineDto] })
  @IsNotEmpty()
  sunday: RecipeDto[];
}
