import { IsNotEmpty } from "class-validator";

export class PermissionCreateDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    path: string;
    @IsNotEmpty()
    method: string;
    @IsNotEmpty()
    description: string;
}