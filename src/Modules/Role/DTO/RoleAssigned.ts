import { IsNotEmpty } from "class-validator";

export class RoleAssignedDTO {
    @IsNotEmpty()
    id:number;
    permissions: number[];
}