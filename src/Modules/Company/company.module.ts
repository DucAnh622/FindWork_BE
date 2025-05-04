import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CompanyEntity from 'src/Entity/company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { JobModule } from '../Job/job.module';
import JobEntity from 'src/Entity/job.entity';
import SpecialityEntity from 'src/Entity/speciality.entity';
import { UploadModule } from '../Upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, JobEntity, SpecialityEntity]),
    JobModule,
    UploadModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
