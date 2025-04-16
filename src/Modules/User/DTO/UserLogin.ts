import { IsEmail, IsNotEmpty } from "class-validator";

export class UserLogin {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
}
    