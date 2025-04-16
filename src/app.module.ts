import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './Modules/User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import UserEntity from './Entity/userEntity';
import { AuthModule } from './Modules/Auth/auth.module';
import RoleEntity from './Entity/role.entity';
import PermissionEntity from './Entity/permission.entity';
import ResumeEntity from './Entity/resume.entity';
import JobEntity from './Entity/job.entity';
import CompanyEntity from './Entity/company.entity';
import SkillEntity from './Entity/skill.entity';
import SubcriberEntity from './Entity/subcribers.entity';
import { CompanyModule } from './Modules/Company/company.module';
import { JobModule } from './Modules/Job/job.module';
import { ResumeModule } from './Modules/Resume/resume.module';
import { RoleModule } from './Modules/Role/role.module';
import { PermissionModule } from './Modules/Permission/permission.module';
import { SkillModule } from './Modules/Skill/skill.module';
import { SpecialityModule } from './Modules/Speciality/speciality.module';
import SpecialityEntity from './Entity/speciality.entity';
import { UploadModule } from './Modules/Upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    CompanyModule,
    JobModule,
    AuthModule,
    ResumeModule,
    RoleModule,
    PermissionModule,
    SkillModule,
    SpecialityModule,
    UploadModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: process.env.DATABASE_NAME,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get(`DB_HOST`),
          port: configService.get(`DB_PORT`),
          username: configService.get('DB_USER'),
          database: configService.get('DB_NAME'),
          entities: [
            UserEntity,
            RoleEntity,
            PermissionEntity,
            ResumeEntity,
            JobEntity,
            CompanyEntity,
            SkillEntity,
            SubcriberEntity,
            SpecialityEntity,
          ],
          synchronize: false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
