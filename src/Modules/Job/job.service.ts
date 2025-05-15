import { BadRequestException, Injectable } from '@nestjs/common';
import { JobCreateDto } from './DTO/JobCreate';
import { JobUpdateDto } from './DTO/JobUpdate';
import { In, Like, Repository } from 'typeorm';
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

  async getListJob(
    page: number,
    limit: number,
    sort: 'ASC' | 'DESC',
    order: string,
  ) {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skills')
      .skip((page - 1) * limit)
      .take(limit);

    if (order === 'company') {
      query.orderBy('company.name', sort);
    } else {
      query.orderBy(`job.${order}`, sort);
    }

    const [jobs, total] = await query.getManyAndCount();

    const list = jobs.map((job) => ({
      ...job,
      company: job.company?.name,
      image: job.company?.image,
      skills: job.skills.map((skill) => skill.name),
    }));

    return {
      list,
      limit,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListJobByCompany(
    page: number,
    limit: number,
    order: string,
    sort: 'ASC' | 'DESC',
    companyId: number,
  ) {
    const [jobs, total] = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skill')
      .where('company.id = :companyId', { companyId })
      .orderBy(`job.${order}`, sort)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const list = jobs.map((job) => ({
      ...job,
      company: job.company?.name,
      image: job.company?.image,
      skills: job.skills?.map((s) => s.name),
    }));

    return {
      list,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchListJob(
    page: number,
    limit: number,
    keyword: string,
    address: string[],
    level: string[],
    step: string[],
    order: string,
    sort: 'ASC' | 'DESC',
  ) {
    const validSort: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const validOrder = order || 'createdAt';

    const qb = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skills')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`job.${validOrder}`, validSort);

    if (keyword) {
      qb.andWhere('job.name LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (address?.length) {
      const addrConditions = address.map(
        (_, i) => `job.address LIKE :addr${i}`,
      );
      const addrParams = Object.fromEntries(
        address.map((val, i) => [`addr${i}`, `%${val}%`]),
      );
      qb.andWhere(`(${addrConditions.join(' OR ')})`, addrParams);
    }

    if (level?.length) {
      qb.andWhere('job.level IN (:...level)', { level });
    }

    if (step?.length) {
      qb.andWhere('job.step IN (:...step)', { step });
    }

    const [jobs, total] = await qb.getManyAndCount();

    const list = jobs.map((job) => ({
      ...job,
      company: job.company?.name || null,
      image: job.company?.image,
      skills: job.skills?.map((skill) => skill.name) || [],
    }));

    return {
      list,
      limit,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getJobById(id: number) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['skills', 'company'],
    });

    if (!job) {
      throw new BadRequestException('Job does not exist!');
    }

    return {
      ...job,
      companyId: job.company?.id ?? null,
      skills: job.skills.map((skill) => skill.id),
      listSkill: job.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
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
