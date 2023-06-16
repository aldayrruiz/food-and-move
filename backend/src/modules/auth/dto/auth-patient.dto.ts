import { IsNotEmpty, IsString } from 'class-validator';

export class AuthPatientDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
