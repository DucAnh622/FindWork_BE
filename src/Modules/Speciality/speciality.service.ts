import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SpecialityEntity from 'src/Entity/speciality.entity';
import { Like, Repository } from 'typeorm';
import { SpecialityCreateDTO } from './DTO/SpecialityCreateDTO';
import { SpecialityUpdateDTO } from './DTO/SpecialityUpdateDTO';
import CompanyEntity from 'src/Entity/company.entity';
import { In } from 'typeorm';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectRepository(SpecialityEntity)
    private readonly specialityRepository: Repository<SpecialityEntity>,
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  async getListAllSpeciality() {
    const data = await this.specialityRepository.find();
    const list = data.map(
      ({
        description,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        deleteBy,
        ...spec
      }) => ({
        ...spec,
      }),
    );
    return list;
  }

  async getListSpeciality(
    page: number,
    limit,
    order: string,
    sort: string,
    keyword: string,
  ) {
    const whereCondition = keyword !== '' ? { name: Like(`%${keyword}%`) } : {};

    const [list, total] = await this.specialityRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [order]: sort,
      },
      where: whereCondition,
    });
    return {
      list: list,
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSpecialityById(id: number) {
    const role = await this.specialityRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!role) {
      throw new BadRequestException('Invalid speciality!');
    }
    return role;
  }

  async createSpeciality(speciality: SpecialityCreateDTO) {
    const exist = await this.specialityRepository.findOne({
      where: { name: speciality.name },
    });
    if (exist) {
      throw new BadRequestException('Speciality already exists!');
    }
    const newSpeciality = this.specialityRepository.create({
      name: speciality.name,
      description: speciality.description,
      deleteBy: 0,
      createdBy: 0,
      updatedBy: 0,
    });

    return await this.specialityRepository.save(newSpeciality);
  }

  async updateSpeciality(speciality: SpecialityUpdateDTO) {
    const exist = await this.specialityRepository.findOne({
      where: { id: speciality.id },
    });

    if (!exist) {
      throw new BadRequestException('Speciality not found!');
    }

    exist.name = speciality.name;
    exist.description = speciality.description;

    return await this.specialityRepository.save(exist);
  }

  async deleteSpeciality(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }

    const specialities = await this.specialityRepository.find({
      where: { id: In(ids) },
      relations: ['companies'],
    });

    if (specialities.length === 0) {
      throw new BadRequestException('Invalid input!');
    }
    const companyIds = specialities.flatMap((speciality) =>
      speciality.companies.map((company) => company.id),
    );

    if (companyIds.length > 0) {
      await this.companyRepository
        .createQueryBuilder()
        .update(CompanyEntity)
        .set({ speciality: null })
        .whereInIds(companyIds)
        .execute();
    }
    return await this.specialityRepository.delete(ids);
  }
}
