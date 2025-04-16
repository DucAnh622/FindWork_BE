import { IsNotEmpty } from "class-validator";

export class SkillUpdateDto {
    @IsNotEmpty()
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
}