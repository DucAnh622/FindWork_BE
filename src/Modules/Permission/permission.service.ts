import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PermissionEntity from 'src/Entity/permission.entity';
import { In, Repository } from 'typeorm';
import { PermissionCreateDTO } from './DTO/PermissionCreateDTO';
import { PermissionUpdateDTO } from './DTO/PermissionUpdateDTO';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async getListPermission(page: number, limit, order: string, sort: string) {
    const [list, total] = await this.permissionRepository.findAndCount({
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

  async getPermissionById(id: number) {
    const permission = await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!permission) {
      throw new BadRequestException('Permission is not exist!');
    }
    return permission;
  }

  async createPermission(permission: PermissionCreateDTO) {
    const exist = await this.permissionRepository.findOne({
      where: {
        name: permission.name,
      },
    });
    if (exist) {
      throw new BadRequestException('Permission is exist!');
    }
    const newPermission = await this.permissionRepository.create({
      ...permission,
      deleteBy: 0,
      updatedBy: 0,
      createdBy: 0,
    });
    return await this.permissionRepository.save(newPermission);
  }

  async updatePermission(permission: PermissionUpdateDTO) {
    const PERMISSION = await this.permissionRepository.findOne({
      where: {
        id: permission.id,
      },
    });
    if (!PERMISSION) {
      throw new BadRequestException('Permission is not exist!');
    }
    PERMISSION.name = permission.name;
    PERMISSION.description = permission.description;
    PERMISSION.method = permission.method;
    PERMISSION.path = permission.path;
    return await this.permissionRepository.save(PERMISSION);
  }

  async deletePermission(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }
  
    const permissions = await this.permissionRepository.find({
      where: { id: In(ids) },
      relations: ['roles'],
    });
  
    if (permissions.length === 0) {
      throw new BadRequestException('Invalid input!');
    }
  
    for (const permission of permissions) {
      if (permission.roles.length > 0) {
        await this.permissionRepository
          .createQueryBuilder()
          .relation(PermissionEntity, 'roles')
          .of(permission)
          .remove(permission.roles);
      }
    }
  
    return await this.permissionRepository.delete(ids);
  }
  
}
