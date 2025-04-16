import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import PermissionEntity from "src/Entity/permission.entity";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";

@Module({
    imports:[TypeOrmModule.forFeature([PermissionEntity])],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}