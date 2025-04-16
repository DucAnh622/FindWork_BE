import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import RoleEntity from "src/Entity/role.entity";
import { PermissionModule } from "../Permission/permission.module";
import PermissionEntity from "src/Entity/permission.entity";

@Module ({
    imports: [TypeOrmModule.forFeature([RoleEntity,PermissionEntity]),PermissionModule],
    controllers: [RoleController],
    providers: [RoleService],
    exports:[RoleService]
})

export class RoleModule {}