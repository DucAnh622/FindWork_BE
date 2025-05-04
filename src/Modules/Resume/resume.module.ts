import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ResumeEntity from 'src/Entity/resume.entity';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { JobModule } from '../Job/job.module';
import { UserModule } from '../User/user.module';
import JobEntity from 'src/Entity/job.entity';
import UserEntity from 'src/Entity/userEntity';
import { UploadModule } from '../Upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResumeEntity, JobEntity, UserEntity]),
    JobModule,
    UserModule,
    UploadModule,
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
