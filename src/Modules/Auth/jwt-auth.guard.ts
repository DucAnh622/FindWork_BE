import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/Decorator/customize';
import { RoleService } from '../Role/role.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const user = await this.validateRequest(context);
    if (!user) {
      throw new UnauthorizedException('Invalid token!');
    }
    const hasPermission = await this.checkPermission(user, context);
    if (!hasPermission) {
      throw new UnauthorizedException('No permission!');
    }
    const result = await super.canActivate(context);
    return result as boolean;
  }

  private async validateRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid token!');
    }

    const token = bearerToken.split(' ')[1];

    try {
      const data = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_PASS'),
      });

      if (!data?.user) {
        throw new UnauthorizedException('Token is invalid!');
      }

      return data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
  }

  private async checkPermission(user: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiPath = request.path;
    if (apiPath.includes('/auth/logout', '/auth/register')) {
      return true;
    }
    const permissions = await this.roleService.getListAllPermissionByRole(
      user.roles,
    );
    if (!permissions || !Array.isArray(permissions)) {
      throw new Error('No permissions found for the role');
    }
    const hasPermission = permissions.some((permission) =>
      apiPath.includes(permission.path),
    );
    return hasPermission;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authorized is invalid!');
    }
    return user;
  }
}

