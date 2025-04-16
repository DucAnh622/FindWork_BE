import { IsNotEmpty } from "class-validator";

export class SpecialityCreateDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
}