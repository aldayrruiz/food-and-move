import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class ConsultDto {
  @IsNotEmpty()
  @IsMongoId()
  patient: string;

  @IsNotEmpty()
  @IsMongoId()
  owner: string;

  @IsMongoId()
  @IsOptional()
  diet?: string;

  @IsMongoId()
  @IsOptional()
  weekRoutine?: string;

  @IsNumber()
  @IsOptional()
  masa?: number; // Masa [Kg]

  @IsNumber()
  @IsOptional()
  imc?: number; // Índice de masa corporal [Kg/m2]

  @IsNumber()
  @IsOptional()
  per_abdominal?: number; // Perímetro abdominal [cm]

  @IsNumber()
  @IsOptional()
  tension?: number; // Tensión arterial [mmHg]

  @IsNumber()
  @IsOptional()
  trigliceridos?: number; // Triglicéridos séricos

  @IsNumber()
  @IsOptional()
  hdl?: number; // HDL - Colesterol

  @IsNumber()
  @IsOptional()
  ldl?: number; // LDL - Colesterol

  @IsNumber()
  @IsOptional()
  hemoglobina?: number; // Hemoglobina glicosilada (hba1c)

  @IsNumber()
  @IsOptional()
  glucosa: number; // Glucosa en plasma

  @IsString()
  @MaxLength(155, { message: 'Comentario no valido, demasiado largo' })
  @IsOptional()
  comments?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  created_at: Date;
}
