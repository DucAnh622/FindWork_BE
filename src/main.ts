import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './Modules/Auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transformInterceptor';
import * as cookieParser from 'cookie-parser';
import { RoleService } from './Modules/Role/role.service';
import { JwtService } from '@nestjs/jwt';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);
  const roleService = app.get(RoleService);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector, roleService, jwtService, configService),
  );
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  app.enableCors({
    origin: configService.get('PORT_CLIENT'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  await app.listen(port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
