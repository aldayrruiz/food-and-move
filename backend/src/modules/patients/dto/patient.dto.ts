import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PatientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'El nombre no es válido, es muy largo' })
  name: string;

  @IsString()
  @MaxLength(255, { message: 'El apellido no es válido, es muy largo' })
  @IsOptional()
  surname: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña no es válida, es muy corta. 8 caracteres como mínimo' })
  @MaxLength(128, { message: 'La contraseña no es válida, es muy larga' })
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birth: Date;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  employees?: string[];

  @IsString()
  @IsMongoId()
  @IsOptional()
  owner?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
