import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserRegister {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  fullname: string;
  image: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  password: string;
}
