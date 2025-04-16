import { IsNotEmpty } from "class-validator";

export class SpecialityUpdateDTO {
    @IsNotEmpty()
    id:number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
}