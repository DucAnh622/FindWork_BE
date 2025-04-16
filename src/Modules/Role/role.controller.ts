import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseMessage } from 'src/Decorator/customize';
import { RoleCreateDTO } from './DTO/RoleCreateDTO';
import { RoleUpdateDTO } from './DTO/RoleUpdateDTO';
import { RoleAssignedDTO } from './DTO/RoleAssigned';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ResponseMessage('Get roles successfully!')
  getListRole(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('sort') sort: string,
  ) {
    return this.roleService.getListRole(page, limit, order, sort);
  }

  @Get('all')
  getListRoleByAll() {
    return this.roleService.getListRoleAll();
  }

  @Get('assigned')
  @ResponseMessage('Get permissions successfully!')
  getListPermissionByRole(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('id') roleId: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
  ) {
    return this.roleService.getListPermissionByRole(
      page,
      limit,
      order,
      sort,
      roleId,
    );
  }

  @Get('/:id')
  @ResponseMessage('Get role successfully!')
  getRoleById(@Param('id') id: number) {
    return this.roleService.getRoleById(id);
  }

  @Post()
  @ResponseMessage('Create role successfully!')
  createRole(@Body() role: RoleCreateDTO) {
    return this.roleService.createRole(role);
  }

  @Put('assigned')
  @ResponseMessage('Assigned role successfully!')
  assignedRole(@Body() role: RoleAssignedDTO) {
    return this.roleService.assignedRole(role);
  }

  @Put('remove/assigned')
  @ResponseMessage('Remove assigned role successfully!')
  removeAssignedRole(@Body() role: RoleAssignedDTO) {
    return this.roleService.removeAssignedRole(role);
  }

  @Put('/:id')
  @ResponseMessage('Update role successfully!')
  updateRole(@Body() role: RoleUpdateDTO) {
    return this.roleService.updateRole(role);
  }

  @Delete()
  @ResponseMessage('Delete role successfully!')
  deleteRole(@Body('ids') ids: number[]) {
    return this.roleService.deleteRole(ids);
  }
}
