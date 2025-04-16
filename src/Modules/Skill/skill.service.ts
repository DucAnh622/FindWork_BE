import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SkillEntity from 'src/Entity/skill.entity';
import { Repository } from 'typeorm';
import { SkillCreateDto } from './DTO/SkillCreateDto';
import { SkillUpdateDto } from './DTO/SkillUpdateDto';
import JobEntity from 'src/Entity/job.entity';
import { In } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async getListAllSkill() {
    const list = await this.skillRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return list;
  }

  async getListSkill(page: number, limit: number, order: string, sort: string) {
    const [list, total] = await this.skillRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [order]: sort,
      },
    });
    return {
      list: list,
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSkill(skill: SkillCreateDto) {
    let exist = await this.skillRepository.findOneBy({ name: skill.name });
    if (exist) {
      throw new BadRequestException('Skill is exist!');
    }
    const newSkill = this.skillRepository.create({
      ...skill,
      deletedBy: 0,
      updatedBy: 0,
      createdBy: 0,
    });
    return await this.skillRepository.save(newSkill);
  }

  async getSkillById(id: number) {
    const role = await this.skillRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!role) {
      throw new BadRequestException('Invalid skill!');
    }
    return role;
  }

  async updateSkill(skill: SkillUpdateDto) {
    let SKILL = await this.skillRepository.findOneBy({ id: skill.id });
    if (!SKILL) {
      throw new BadRequestException('Skill is exist!');
    }
    SKILL.name = skill.name;
    SKILL.description = skill.description;
    return await this.skillRepository.save(SKILL);
  }

  async deleteSkill(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }

    const skills = await this.skillRepository.find({
      where: { id: In(ids) },
      relations: ['jobs'],
    });

    if (skills.length === 0) {
      throw new BadRequestException('Invalid input!');
    }

    const jobIds = skills.flatMap((skill) => skill.jobs.map((job) => job.id));

    if (jobIds.length > 0) {
      await this.jobRepository
        .createQueryBuilder()
        .relation(JobEntity, 'skills')
        .of(jobIds)
        .remove(skills);
    }

    return await this.skillRepository.delete(ids);
  }
}
