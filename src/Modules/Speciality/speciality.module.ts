import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import SpecialityEntity from "src/Entity/speciality.entity";
import { SpecialityController } from "./speciality.controller";
import { SpecialityService } from "./speciality.service";
import { CompanyModule } from "../Company/company.module";
import CompanyEntity from "src/Entity/company.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SpecialityEntity,CompanyEntity]),CompanyModule],
    controllers: [SpecialityController],
    providers: [SpecialityService],
    exports: [SpecialityService],
})
export class SpecialityModule {

}