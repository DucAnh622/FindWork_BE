import { BadRequestException, Injectable } from '@nestjs/common';
import { JobCreateDto } from './DTO/JobCreate';
import { JobUpdateDto } from './DTO/JobUpdate';
import { In, Repository } from 'typeorm';
import JobEntity from 'src/Entity/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import SkillEntity from 'src/Entity/skill.entity';
import CompanyEntity from 'src/Entity/company.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async filterListJob(
    page: number,
    limit: number,
    sort: string,
    key: string,
    companyId: number,
    skillId: number[],
    experience: string[],
    level: string[],
    address: string,
  ) {
    const queryBuilder = this.jobRepository.createQueryBuilder('job');
    if (companyId) {
      queryBuilder.andWhere('job.companyId = :companyId', { companyId });
    }
    if (address) {
      queryBuilder.andWhere('job.address = :address', { address });
    }
    if (key) {
      queryBuilder.andWhere('job.jobTitle LIKE :key', { key: `%${key}%` });
    }
    if (skillId && skillId.length > 0) {
      queryBuilder.andWhere('job.skillId IN (:...skillId)', { skillId });
    }
    if (experience && experience.length > 0) {
      queryBuilder.andWhere('job.experience IN (:...experience)', {
        experience,
      });
    }
    if (level && level.length > 0) {
      queryBuilder.andWhere('job.level IN (:...level)', { level });
    }
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`job.${sort}`, 'DESC');
    const [list, total] = await queryBuilder.getManyAndCount();
    return {
      list: list,
      limit: limit,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListJob(
    page: number,
    limit: number,
    sort: 'ASC' | 'DESC',
    order: string,
  ) {
    let [jobs, total] = await this.jobRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['company', 'skills'],
      order: {
        [order]: sort,
      },
    });

    const list = jobs.map((job) => {
      return {
        ...job,
        company: job.company?.name,
        skills: job.skills.map((skill) => skill.name),
      };
    });

    return {
      list: list,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchListJob(page: number, limit: number, sort: string, key: string) {
    let [list, total] = await this.jobRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: `%${key}%`,
      },
      order: {
        [sort]: 'DESC',
      },
    });
    return {
      list: list,
      limit: limit,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getJobById(id: number) {
    const job = await this.jobRepository.findOne({
      where: { id: id },
      relations: ['skills', 'company'],
    });

    if (!job) {
      throw new BadRequestException('Job does not exist!');
    }
    let { company, ...data } = job;
    return {
      ...data,
      companyId: job.company?.id || null,
      skills: job.skills.map((skill) => skill.id),
    };
  }

  async createJob(job: JobCreateDto) {
    const company = await this.companyRepository.findOne({
      where: { id: job.companyId },
      relations: ['speciality'],
    });
    if (!company) {
      throw new BadRequestException('Invalid data!');
    }
    let skills: SkillEntity[] = [];
    if (job.skills && job.skills.length > 0) {
      skills = await this.skillRepository.findByIds(job.skills);
      if (skills.length !== job.skills.length) {
        throw new BadRequestException('Invalid data!');
      }
    }
    const newJob = this.jobRepository.create({
      ...job,
      company,
      skills,
      deleteBy: 0,
      createdBy: 0,
      updatedBy: 0,
    });

    return await this.jobRepository.save(newJob);
  }

  async updateJob(job: JobUpdateDto) {
    const jobEntity = await this.jobRepository.findOne({
      where: { id: job.id },
      relations: ['skills'],
    });

    if (!jobEntity) {
      throw new BadRequestException('Job does not exist!');
    }

    jobEntity.name = job.name;
    jobEntity.description = job.description;
    jobEntity.level = job.level;
    jobEntity.quantity = job.quantity;
    jobEntity.experience = job.experience;
    jobEntity.salary = job.salary;
    jobEntity.address = job.address;
    jobEntity.step = job.step;
    jobEntity.workTime = job.workTime;
    jobEntity.workDay = job.workDay;
    jobEntity.education = job.education;
    jobEntity.startDate = job.startDate;
    jobEntity.endDate = job.endDate;

    if (job.companyId) {
      const company = await this.companyRepository.findOne({
        where: { id: job.companyId },
        relations: ['speciality'],
      });
      if (company) {
        jobEntity.company = company;
      }
    }

    if (job.skills && job.skills.length > 0) {
      const skills = await this.skillRepository.findByIds(job.skills);
      if (skills.length !== job.skills.length) {
        throw new BadRequestException('Some skills are invalid!');
      }

      await this.jobRepository
        .createQueryBuilder()
        .relation(JobEntity, 'skills')
        .of(jobEntity)
        .remove(jobEntity.skills);

      await this.jobRepository
        .createQueryBuilder()
        .relation(JobEntity, 'skills')
        .of(jobEntity)
        .add(skills);

      jobEntity.skills = skills;
    } else {
      await this.jobRepository
        .createQueryBuilder()
        .relation(JobEntity, 'skills')
        .of(jobEntity)
        .remove(jobEntity.skills);
      jobEntity.skills = [];
    }
    return await this.jobRepository.save(jobEntity);
  }

  async deleteJob(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }
  
    const jobs = await this.jobRepository.find({
      where: { id: In(ids) },
      relations: ['resumes', 'skills'],
    });
  
    if (jobs.length === 0) {
      throw new BadRequestException('Invalid input!');
    }
  
    for (const job of jobs) {
      if (job.resumes.length > 0) {
        await this.jobRepository
          .createQueryBuilder()
          .relation(JobEntity, 'resumes')
          .of(job.id)
          .remove(job.resumes);
      }
  
      if (job.skills.length > 0) {
        await this.jobRepository
          .createQueryBuilder()
          .relation(JobEntity, 'skills')
          .of(job.id)
          .remove(job.skills);
      }
    }
  
    return await this.jobRepository.delete(ids);
  }
  
}
