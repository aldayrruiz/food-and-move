import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class EmployeeDto {
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
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  admin: boolean;
}
