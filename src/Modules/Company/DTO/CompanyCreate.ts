import { IsNotEmpty } from "class-validator";

export class CompanyCreate {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    image: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    specialityId: number;
    @IsNotEmpty()
    phone: string;
}