import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña no es válida, es muy corta. 8 caracteres como mínimo' })
  @MaxLength(128, { message: 'La contraseña no es válida, es muy larga' })
  newPassword: string;
}
