import { forwardRef, Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import JobEntity from 'src/Entity/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillModule } from '../Skill/skill.module';
import SkillEntity from 'src/Entity/skill.entity';
import CompanyEntity from 'src/Entity/company.entity';
import { CompanyModule } from '../Company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity, SkillEntity, CompanyEntity]),
    forwardRef(() => SkillModule),
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
