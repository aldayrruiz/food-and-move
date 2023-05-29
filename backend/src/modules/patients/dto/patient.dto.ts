import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class PatientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'El nombre no es válido, es muy largo' })
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255, { message: 'El apellido no es válido, es muy largo' })
  @IsOptional()
  surname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña no es válida, es muy corta. 8 caracteres como mínimo' })
  @MaxLength(128, { message: 'La contraseña no es válida, es muy larga' })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birth: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsObjectId()
  employee: string;
}
