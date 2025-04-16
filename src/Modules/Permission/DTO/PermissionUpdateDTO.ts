import { IsNotEmpty } from "class-validator";

export class PermissionUpdateDTO {
    @IsNotEmpty()
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    path: string;
    @IsNotEmpty()
    method: string;
    @IsNotEmpty()
    description: string;
}