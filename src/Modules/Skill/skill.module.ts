import { forwardRef, Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SkillEntity from 'src/Entity/skill.entity';
import { JobModule } from '../Job/job.module';
import JobEntity from 'src/Entity/job.entity';
import CompanyEntity from 'src/Entity/company.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillEntity, JobEntity, CompanyEntity]), 
    forwardRef(() => JobModule),
  ],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
