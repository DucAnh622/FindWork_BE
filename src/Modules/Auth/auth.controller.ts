import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/Decorator/customize';
import { UserRegister } from '../User/DTO/UserRegister';
import { UserService } from '../User/user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { IUSER } from '../User/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login success!')
  async login(
    @Request() req,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    return this.authService.login(req.user, response);
  }

  @Post('register')
  @Public()
  @ResponseMessage('Register success!')
  registerUser(@Body() users: UserRegister) {
    return this.userService.create(users);
  }

  @ResponseMessage('Get account success!')
  @Get('account')
  getAccountUser(@User() user: IUSER) {
    return {
      user,
    };
  }

  @Get('refresh')
  @Public()
  @ResponseMessage('Refresh success!')
  refreshUser(
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.refreshToken(refreshToken, response);
  }

  @ResponseMessage('Logout success!')
  @Post('logout')
  logout(
    @User() user: IUSER,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    return this.authService.logout(response, user);
  }
}
