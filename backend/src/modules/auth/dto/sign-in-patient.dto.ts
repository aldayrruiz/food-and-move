import { IsNotEmpty, IsString } from 'class-validator';

export class SignInPatientDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
