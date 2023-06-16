import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class RoutineDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Título no valido, demasiado largo' })
  title: string;

  @IsString()
  @MaxLength(155, { message: 'Descripción no valido, demasiado largo' })
  @IsOptional()
  description: string;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @Type(() => String)
  links: string[];

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @Type(() => String)
  videos: string[];

  @IsObjectId()
  @IsOptional()
  attachment: string;
}
