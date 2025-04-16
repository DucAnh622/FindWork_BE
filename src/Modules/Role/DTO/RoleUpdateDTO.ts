import { IsNotEmpty } from "class-validator";

export class RoleUpdateDTO {
    @IsNotEmpty()
    id:number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
}