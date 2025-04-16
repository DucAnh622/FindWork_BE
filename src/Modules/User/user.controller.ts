import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdate } from './DTO/UserUpdate';
import { Public, ResponseMessage, User } from 'src/Decorator/customize';
import { UserAssignedDTO } from './DTO/UserAssigned';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ResponseMessage('Get list success!')
  listUser(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('order') order: string,
  ) {
    return this.userService.list(page, limit, order, sort);
  }

  @Get('/:id')
  @ResponseMessage('Get success!')
  getUser(@Param('id') id: number) {
    return this.userService.get(id);
  }

  @Get('/personal')
  @ResponseMessage('Get success!')
  getAccountDetail(@Request() req) {
    return this.userService.getAccount(req.user);
  }

  @Put('/assigned/role')
  @ResponseMessage('Update success!')
  addRoleUser(@Body() user: UserAssignedDTO) {
    return this.userService.updateUserRoles(user);
  }

  @Put('personal')
  @ResponseMessage('Update success!')
  updateUser(@Body() users: UserUpdate) {
    return this.userService.update(users);
  }

  @Delete('personal')
  @ResponseMessage('Delete success!')
  deleteUser(@Request() req) {
    return this.userService.delete(req.user);
  }

  @Delete()
  @ResponseMessage('Delete success!')
  delete(@Body('ids') ids: number[]) {
    return this.userService.deleteMultiple(ids);
  }
}
