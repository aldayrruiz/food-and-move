import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@shared/enums/rating';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { RoutineDto } from 'src/modules/routines/dto/routine.dto';

export class MoveDto extends RoutineDto {
  @IsObjectId()
  @IsNotEmpty()
  patient: string;

  @IsString()
  @MaxLength(155, { message: 'Comentario no valido, demasiado largo' })
  @IsOptional()
  comments: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsBoolean()
  @IsOptional()
  done: boolean;

  @ApiProperty({ enum: Rating })
  @IsEnum(Rating)
  @IsOptional()
  rating: Rating;
}
