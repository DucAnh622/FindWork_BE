import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyEntity from 'src/Entity/company.entity';
import { In, Repository } from 'typeorm';
import { CompanyCreate } from './DTO/CompanyCreate';
import { CompanyUpdate } from './DTO/CompanyUpdate';
import JobEntity from 'src/Entity/job.entity';
import SpecialityEntity from 'src/Entity/speciality.entity';
import { CloudinaryService } from '../Upload/cloudinary.service';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getListAllCompany() {
    const list = await this.companyRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return list;
  }

  async getListCompany(
    page: number,
    limit: number,
    order: string,
    sort: 'ASC' | 'DESC',
  ) {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.speciality', 'speciality')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .skip((page - 1) * limit)
      .take(limit);

    const validColumns = [
      'id',
      'name',
      'image',
      'address',
      'phone',
      'description',
    ];

    if (order === 'speciality') {
      query.addOrderBy('speciality.name', sort);
    } else if (validColumns.includes(order)) {
      query.addOrderBy(`company.${order}`, sort);
    } else {
      query.addOrderBy('company.name', sort);
    }

    const [companies, total] = await query.getManyAndCount();

    const list = companies.map((company) => ({
      ...company,
      speciality: company.speciality?.name || null,
      jobCount: company.jobs ? company.jobs.length : 0,
    }));

    return {
      list: list,
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchListCompany(
    page: number,
    limit: number,
    keyword: string,
    order: string,
    sort: 'ASC' | 'DESC',
    specialityId: number,
    address: string[],
  ) {
    const validSort: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const validOrder = order || 'createdAt';

    const qb = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.speciality', 'speciality')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .skip((page - 1) * limit)
      .take(limit);

    if (specialityId) {
      qb.andWhere('speciality.id = :specialityId', { specialityId });
    }

    if (keyword) {
      qb.andWhere('company.name LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (address?.length) {
      const addrConditions = address.map(
        (_, i) => `company.address LIKE :addr${i}`,
      );
      const addrParams = Object.fromEntries(
        address.map((val, i) => [`addr${i}`, `%${val}%`]),
      );
      qb.andWhere(`(${addrConditions.join(' OR ')})`, addrParams);
    }

    const validColumns = [
      'id',
      'name',
      'image',
      'address',
      'phone',
      'description',
    ];
    if (order === 'speciality') {
      qb.addOrderBy('speciality.name', validSort);
    } else if (validColumns.includes(order)) {
      qb.addOrderBy(`company.${validOrder}`, validSort);
    } else {
      qb.addOrderBy('company.name', validSort);
    }

    const [companies, total] = await qb.getManyAndCount();

    const list = companies.map((company) => ({
      ...company,
      speciality: company.speciality?.name || null,
      jobCount: company.jobs ? company.jobs.length : 0,
    }));

    return {
      list,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createCompany(companyCreate: CompanyCreate, file: Express.Multer.File) {
    const exist = await this.companyRepository.findOneBy({
      name: companyCreate.name,
    });
    if (exist) {
      throw new BadRequestException('Company is exist!');
    }
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file.buffer);
      if (!result) {
        throw new BadRequestException('Upload image failed!');
      }
      companyCreate.image = result.url;
    }
    const data = await this.companyRepository.create(companyCreate);
    data.speciality = { id: companyCreate.specialityId } as SpecialityEntity;
    data.deleteBy = 0;
    data.createdBy = 0;
    data.updatedBy = 0;
    return await this.companyRepository.save(data);
  }

  async updateCompany(companyUpdate: CompanyUpdate, file) {
    const company = await this.companyRepository.findOneBy({
      id: companyUpdate.id,
    });
    if (company === null) {
      throw new BadRequestException('Company is not exist!');
    }
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file.buffer);
      if (!result) {
        throw new BadRequestException('Upload image failed!');
      }
      companyUpdate.image = result.url;
    }
    company.name = companyUpdate.name;
    company.address = companyUpdate.address;
    company.description = companyUpdate.description;
    company.phone = companyUpdate.phone;
    company.image = companyUpdate.image;
    if (companyUpdate.specialityId) {
      company.speciality = {
        id: companyUpdate.specialityId,
      } as SpecialityEntity;
    }
    return await this.companyRepository.save(company);
  }

  async getByIdCompany(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id: id },
      relations: ['speciality'],
    });
    if (company === null) {
      throw new BadRequestException('Company is not exist!');
    }
    return {
      ...company,
      speciality: company.speciality?.name,
      specialityId: company.speciality?.id,
    };
  }

  async deleteCompany(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }

    const companies = await this.companyRepository.find({
      where: { id: In(ids) },
      relations: ['jobs', 'speciality'],
    });

    if (companies.length === 0) {
      throw new BadRequestException('Invalid input!');
    }

    for (const company of companies) {
      company.jobs = [];
      company.speciality = null;
      await this.companyRepository.save(company);
    }

    return await this.companyRepository.delete(ids);
  }
}
