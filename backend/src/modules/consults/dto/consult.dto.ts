import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class ConsultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObjectId()
  patient: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  masa: number; // Masa [Kg]

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  imc: number; // Índice de masa corporal [Kg/m2]

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  per_abdominal: number; // Perímetro abdominal [cm]

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tension: number; // Tensión arterial [mmHg]

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  trigliceridos: number; // Triglicéridos séricos

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hdl: number; // HDL - Colesterol

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ldl: number; // LDL - Colesterol

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hemoglobina: number; // Hemoglobina glicosilada (hba1c)

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  glucosa: number; // Glucosa en plasma

  @ApiProperty()
  @IsString()
  @MaxLength(155, { message: 'Comentario no valido, demasiado largo' })
  @IsOptional()
  comments: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  created_at: Date;
}
