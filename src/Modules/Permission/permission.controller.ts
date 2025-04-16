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
import { PermissionCreateDTO } from './DTO/PermissionCreateDTO';
import { PermissionUpdateDTO } from './DTO/PermissionUpdateDTO';
import { PermissionService } from './permission.service';
import { ResponseMessage } from 'src/Decorator/customize';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ResponseMessage('Get permissions successfully!')
  getListPermission(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
  ) {
    return this.permissionService.getListPermission(page, limit, order, sort);
  }

  @Get('/:id')
  @ResponseMessage('Get permission successfully!')
  getPermissionById(@Param('id') id: number) {
    return this.permissionService.getPermissionById(id);
  }

  @Post()
  @ResponseMessage('Create permission successfully!')
  createPermission(@Body() permission: PermissionCreateDTO) {
    return this.permissionService.createPermission(permission);
  }

  @Put('/:id')
  @ResponseMessage('Update permission successfully!')
  updatePermission(@Body() permission: PermissionUpdateDTO) {
    return this.permissionService.updatePermission(permission);
  }

  @Delete()
  @ResponseMessage('Delete permission successfully!')
  deletePermission(@Body('ids') ids: number[]) {
    return this.permissionService.deletePermission(ids);
  }
}
