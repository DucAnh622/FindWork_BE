import { IsNotEmpty } from "class-validator";

export class RoleCreateDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
}