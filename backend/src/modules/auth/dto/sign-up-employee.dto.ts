import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SignUpEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'El nombre no es válido, es muy largo' })
  name: string;

  @IsString()
  @MaxLength(255, { message: 'El apellido no es válido, es muy largo' })
  @IsOptional()
  surname?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  admin?: boolean;

  @ApiHideProperty()
  readonly refreshToken?: string;
}
