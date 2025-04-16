import { IsNotEmpty } from "class-validator";

export class JobCreateDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    level: string;
    @IsNotEmpty()
    experience: string;
    @IsNotEmpty()
    startDate: Date;
    @IsNotEmpty()
    salary: string;
    @IsNotEmpty()
    education: string;
    @IsNotEmpty()
    companyId: number;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    workTime: string;
    @IsNotEmpty()
    workDay: string;
    @IsNotEmpty()
    step: string;
    @IsNotEmpty()
    endDate: Date;
    @IsNotEmpty()
    skills: []
}