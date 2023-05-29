import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña no es válida, es muy corta. 8 caracteres como mínimo' })
  @MaxLength(128, { message: 'La contraseña no es válida, es muy larga' })
  password: string;
}
