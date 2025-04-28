import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../User/user.service';
import { JwtService } from '@nestjs/jwt';
import { IUSER } from '../User/user.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user) {
      const isValid = await this.userService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        let { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: IUSER, response: Response) {
    const { id, username, email, roles, phone, image } = user;
    const payload = {
      sub: 'token access',
      iss: 'Server',
      user: {
        _id: id,
        image: image,
        name: username,
        email: email,
        phone: phone,
        roles: roles,
      },
    };
    const refreshtoken = this.createRefreshToken(payload);
    const expiresInStr = this.configService.get<string>('JWTR_EXPIRES');
    const expiresInMs = ms(expiresInStr);
    if (!expiresInMs) {
      throw new Error(`Invalid JWTR_EXPIRES format: ${expiresInStr}`);
    }
    await this.userService.updateRefreshToken(refreshtoken, email);
    response.cookie('refresh_token', refreshtoken, {
      httpOnly: true,
      maxAge: expiresInMs,
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: id,
        name: username,
        image: image,
        email: email,
        phone: phone,
        roles: roles,
      },
    };
  }

  createRefreshToken = (payload) => {
    const expiresInStr = this.configService.get<string>('JWTR_EXPIRES');
    const expiresInMs = ms(expiresInStr);
    if (!expiresInMs) {
      throw new Error(`Invalid JWTR_EXPIRES format: ${expiresInStr}`);
    }
    const refreshtoken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWTR_PASS'),
      expiresIn: expiresInMs,
    });
    return refreshtoken;
  };

  async refreshToken(refreshToken: string, response: Response) {
    try {
      let res = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWTR_PASS'),
      });
      console.log(res);
      let data = await this.userService.findByRefreshToken(refreshToken);
      if (data) {
        const { id, username, email, roles, phone, image } = data;
        const payload = {
          sub: 'token access',
          iss: 'Server',
          user: {
            _id: id,
            name: username,
            image: image,
            email: email,
            phone: phone,
            roles: roles,
          },
        };
        const refreshtoken = this.createRefreshToken(payload);
        const expiresInStr = this.configService.get<string>('JWTR_EXPIRES');
        const expiresInMs = ms(expiresInStr);
        if (!expiresInMs) {
          throw new Error(`Invalid JWTR_EXPIRES format: ${expiresInStr}`);
        }
        await this.userService.updateRefreshToken(refreshtoken, email);
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refreshtoken, {
          httpOnly: true,
          maxAge: expiresInMs,
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id: id,
            name: username,
            image: image,
            email: email,
            phone: phone,
            roles: roles,
          },
        };
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid token!');
    }
  }

  async logout(response: Response, user: IUSER) {
    response.clearCookie('refresh_token');
    await this.userService.updateRefreshToken('', user.email);
    return 'OK';
  }
}
