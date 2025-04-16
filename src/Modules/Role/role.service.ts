import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleCreateDTO } from './DTO/RoleCreateDTO';
import { In, Repository } from 'typeorm';
import { RoleUpdateDTO } from './DTO/RoleUpdateDTO';
import { InjectRepository } from '@nestjs/typeorm';
import RoleEntity from 'src/Entity/role.entity';
import PermissionEntity from 'src/Entity/permission.entity';
import { RoleAssignedDTO } from './DTO/RoleAssigned';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async getListRoleAll() {
    const data = await this.roleRepository.find();
    if (!data) {
      throw new BadRequestException('Role not found');
    }
    return data;
  }

  async getListAllPermissionByRole(roles: number[]) {
    const data = await this.roleRepository.findOne({
      where: {
        name: In(roles),
      },
      relations: ['permissions'],
    });

    if (!data) {
      throw new BadRequestException('Permissions not found!');
    }
    return data.permissions;
  }

  async getListPermissionByRole(
    page: number,
    limit: number,
    order: string,
    sort: 'ASC' | 'DESC',
    roleId: number,
  ) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const [permissions, total] = await this.permissionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { [order]: sort },
    });

    const permissionIds = new Set(role.permissions.map((p) => p.id));

    const list = permissions.map((permission) => ({
      ...permission,
      check: permissionIds.has(permission.id),
    }));

    return {
      list,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListRole(page: number, limit: number, order: string, sort: string) {
    const [list, total] = await this.roleRepository.findAndCount({
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

  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!role) {
      throw new BadRequestException('Invalid role!');
    }
    return role;
  }

  async createRole(role: RoleCreateDTO) {
    const exist = await this.roleRepository.findOne({
      where: { name: role.name },
    });
    if (exist) {
      throw new BadRequestException('Role already exists!');
    }
    const newRole = this.roleRepository.create({
      name: role.name,
      description: role.description,
      deleteBy: 0,
      createdBy: 0,
      updatedBy: 0,
    });

    return await this.roleRepository.save(newRole);
  }

  async updateRole(role: RoleUpdateDTO) {
    const exist = await this.roleRepository.findOne({
      where: { id: role.id },
    });
    if (!exist) {
      throw new BadRequestException('Role not found!');
    }
    exist.name = role.name;
    exist.description = role.description;
    return await this.roleRepository.save(exist);
  }

  async assignedRole(role: RoleAssignedDTO) {
    const existingRole = await this.roleRepository.findOne({
      where: { id: role.id },
      relations: ['permissions'],
    });

    if (!existingRole) {
      throw new BadRequestException('Permissions not found!');
    }
    const currentPermissionIds = existingRole.permissions.map((p) => p.id);
    const toRemove = currentPermissionIds.filter(
      (id) => !role.permissions.includes(id),
    );
    const toAdd = role.permissions.filter(
      (id) => !currentPermissionIds.includes(id),
    );
    if (toRemove.length === 0 && toAdd.length === 0) {
      return;
    }
    if (toAdd.length > 0) {
      return await this.roleRepository
        .createQueryBuilder()
        .relation('permissions')
        .of(role.id)
        .add(toAdd);
    }
    if (toRemove.length > 0) {
      return await this.roleRepository
        .createQueryBuilder()
        .relation('permissions')
        .of(role.id)
        .remove(toRemove);
    }
  }

  async removeAssignedRole(role: RoleAssignedDTO) {
    const existingRole = await this.roleRepository.findOne({
      where: { id: role.id },
      relations: ['permissions'],
    });
    if (!existingRole) {
      throw new BadRequestException('Role not found!');
    }
    return await this.roleRepository
      .createQueryBuilder()
      .relation('permissions')
      .of(existingRole.id)
      .remove(role.permissions);
  }

  async deleteRole(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }

    const roles = await this.roleRepository.find({
      where: { id: In(ids) },
      relations: ['permissions'],
    });

    if (roles.length === 0) {
      throw new BadRequestException('Invalid input!');
    }

    const permissions = roles.flatMap((role) =>
      role.permissions.map((permission) => permission.id),
    );

    if (permissions.length > 0) {
      await this.permissionRepository
        .createQueryBuilder()
        .relation(PermissionEntity, 'roles')
        .of(permissions)
        .remove(permissions);
    }

    return await this.roleRepository.delete(ids);
  }
}
