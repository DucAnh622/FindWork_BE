import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResumeEntity from 'src/Entity/resume.entity';
import { In, Repository } from 'typeorm';
import { ResumeCreateDto } from './DTO/ResumeCreateDto';
import JobEntity from 'src/Entity/job.entity';
import UserEntity from 'src/Entity/userEntity';
import { ResumeUpdateDto } from './DTO/ResumeUpdateDto';
import { CloudinaryService } from '../Upload/cloudinary.service';
import { IUSER } from '../User/user.interface';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getListResume(
    page: number,
    limit: number,
    sort: 'ASC' | 'DESC',
    order: string,
  ) {
    const [jobs, total] = await this.resumeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      order: {
        [order]: sort,
      },
    });

    const list = jobs.map((job) => {
      const { user, ...rest } = job;
      return {
        ...rest,
        fullname: job.user?.fullname,
        email: job.user?.email,
      };
    });

    return {
      list,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListResumeByUserId(
    page: number,
    limit: number,
    sort: 'ASC' | 'DESC',
    order: string,
    user: IUSER,
  ) {
    const { id } = user;
    const [list, total] = await this.resumeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      where: {
        user: {
          id: id,
        },
      },
      order: {
        [order]: sort,
      },
    });
    return {
      list: list,
      limit: limit,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListResumeByJobId(
    page: number,
    limit: number,
    sort: 'ASC' | 'DESC',
    order: string,
    id: number,
  ) {
    const [jobs, total] = await this.resumeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      where: {
        jobs: {
          id: id,
        },
      },
      order: {
        [order]: sort,
      },
    });
    const list = jobs.map((job) => {
      const { user, ...rest } = job;
      return {
        ...rest,
        fullname: job.user?.fullname,
        email: job.user?.email,
      };
    });
    return {
      list: list,
      limit: limit,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListResumeByStatus(
    page: number,
    limit: number,
    sort: 'ASC' | 'DESC',
    order: string,
    status: string,
  ) {
    const [list, total] = await this.resumeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      where: {
        status: status,
      },
      order: {
        [order]: sort,
      },
    });
    return {
      list: list,
      limit: limit,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getResumeById(id: number) {
    let resume = await this.resumeRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!resume) {
      throw new BadRequestException('Resume is not exist!');
    }
    return resume;
  }

  async createResume(
    userReq: IUSER,
    resume: ResumeCreateDto,
    url: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userReq.id },
    });

    if (!user) {
      throw new BadRequestException('Authorized is invalid!');
    }

    if (url) {
      const result = await this.cloudinaryService.uploadFile(url.buffer);
      if (!result) {
        throw new BadRequestException('Upload file failed!');
      }
      resume.url = result.url;
    }
    let jobs: JobEntity[] = [];
    if (resume.jobs && resume.jobs.length > 0) {
      jobs = await this.jobRepository.findByIds(resume.jobs);

      if (jobs.length !== resume.jobs.length) {
        throw new BadRequestException('Invalid data!');
      }
    }

    const newResume = this.resumeRepository.create({
      template: resume.template,
      nameCV: resume.nameCV,
      url: resume.url,
      status: 'new',
      user: user,
      jobs: jobs,
      deleteBy: 0,
      updatedBy: 0,
      createdBy: 0,
    });

    return await this.resumeRepository.save(newResume);
  }

  async updateResume(resume: ResumeUpdateDto) {
    let RESUME = await this.resumeRepository.findOne({
      where: { id: resume.id, status: 'Applied' },
      relations: ['user'],
    });
    if (!RESUME) {
      throw new BadRequestException('Resume is not exist!');
    }
    RESUME.status = resume.status;
    return await this.resumeRepository.save(RESUME);
  }

  async deleteResume(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }

    const resumes = await this.resumeRepository.find({
      where: { id: In(ids) },
      relations: ['user', 'jobs'],
    });

    if (resumes.length === 0) {
      throw new BadRequestException('Invalid input!');
    }

    for (const resume of resumes) {
      if (resume.jobs.length > 0) {
        await this.resumeRepository
          .createQueryBuilder()
          .relation(ResumeEntity, 'jobs')
          .of(resume.id)
          .remove(resume.jobs);
      }
    }

    return await this.resumeRepository.delete(ids);
  }
}
