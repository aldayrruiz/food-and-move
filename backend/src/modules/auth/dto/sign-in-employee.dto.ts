import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
