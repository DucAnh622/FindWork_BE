import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../../Entity/userEntity';
import { UserUpdate } from './DTO/UserUpdate';
import { UserRegister } from './DTO/UserRegister';
import RoleEntity from 'src/Entity/role.entity';
import { UserAssignedDTO } from './DTO/UserAssigned';
import { IUSER } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  hashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async list(page: number, limit: number, order: string, sort: 'ASC' | 'DESC') {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .skip((page - 1) * limit)
      .take(limit);

    const validColumns = [
      'id',
      'username',
      'email',
      'fullname',
      'phone',
      'address',
      'createdAt',
      'updatedAt',
    ];

    if (order === 'role') {
      query.addOrderBy('role.name', sort);
    } else if (validColumns.includes(order)) {
      query.addOrderBy(`user.${order}`, sort);
    }

    const [users, total] = await query.getManyAndCount();

    return {
      list: users.map(({ password, roles, ...user }) => ({
        ...user,
        roles: roles?.map(({ id, name }) => ({ id, name })) || [],
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserRoles(user: UserAssignedDTO) {
    const data = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['roles'],
    });

    if (!data) {
      throw new NotFoundException('User không tồn tại');
    }

    const currentRoleIds = data.roles.map((role) => role.id);

    if (
      JSON.stringify(currentRoleIds.sort()) ===
      JSON.stringify(user.roleIds.sort())
    ) {
      return data;
    }

    const roles = await this.roleRepository.findByIds(user.roleIds);

    data.roles = roles;
    return await this.userRepository.save(data);
  }

  async get(id: number) {
    const userData = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (userData) {
      const { password, roles, ...data } = userData;
      return {
        ...data,
        roles: roles?.map((role) => role.name) || [],
      };
    } else {
      throw new BadRequestException('Invalid input!');
    }
  }

  async getAccount(user: IUSER) {
    const userData = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (userData) {
      const { password, roles, ...data } = userData;
      return data;
    } else {
      throw new BadRequestException('Invalid input!');
    }
  }

  async findOne(email: string) {
    const userData = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });

    if (userData) {
      const { roles, ...data } = userData;
      return {
        ...data,
        roles: roles?.map((role) => role.name) || [],
      };
    }
    throw new BadRequestException('Invalid input!');
  }

  async create(users: UserRegister) {
    const exist = await this.userRepository.findOneBy({ email: users.email });
    if (exist) {
      throw new BadRequestException('Email already exists!');
    }

    const userData = this.userRepository.create(users);
    userData.password = this.hashPassword(userData.password);
    const role = await this.roleRepository.findOneBy({ id: 3 });
    if (role) {
      userData.roles = [role];
    } else {
      throw new NotFoundException('Role not found');
    }
    userData.deleteBy = 0;
    userData.updatedBy = 0;
    userData.createdBy = 0;
    return await this.userRepository.save(userData);
  }

  async update(users: UserUpdate) {
    const userData = await this.userRepository.findOne({
      where: { id: users.id },
      relations: ['roles'],
    });

    if (userData) {
      userData.fullname = users.fullname;
      userData.username = users.username;
      userData.address = users.address;
      userData.image = users.image;
      userData.email = users.email;
      userData.phone = users.phone;

      if (users.roleIds && users.roleIds.length > 0) {
        const roles = await this.roleRepository.findByIds(users.roleIds);
        userData.roles = roles;
      }

      return await this.userRepository.save(userData);
    } else {
      throw new BadRequestException('Invalid input!');
    }
  }

  async updateRefreshToken(refreshtoken: string, email: string) {
    const data = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });
    if (data) {
      data.refreshToken = refreshtoken;
      return await this.userRepository.save(data);
    } else {
      throw new BadRequestException('Invalid input!');
    }
  }

  async findByRefreshToken(refreshToken: string) {
    const userData = await this.userRepository.findOne({
      where: { refreshToken: refreshToken },
      relations: ['roles'],
    });
    if (userData !== null) {
      const { password, roles, ...data } = userData;
      return {
        ...data,
        roles: roles?.map((role) => role.name) || [],
      };
    } else {
      throw new BadRequestException('Invalid input!');
    }
  }

  async delete(user: IUSER) {
    const userData = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['roles', 'company', 'resumes'],
    });
    if (userData !== null) {
      if (userData.roles && userData.roles.length > 0) {
        userData.roles = [];
      }
      if (userData.company) {
        userData.company = null;
      }
      if (userData.resumes) {
        userData.resumes = [];
      }
      await this.userRepository.save(userData);
      return await this.userRepository.delete(userData.id);
    } else {
      throw new BadRequestException('User not found!');
    }
  }

  async deleteMultiple(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid data');
    }

    const users = await this.userRepository.find({
      where: { id: In(ids) },
      relations: ['roles', 'company', 'resumes'],
    });

    if (users.length === 0) {
      throw new BadRequestException('Invalid input!');
    }

    for (const user of users) {
      user.roles = [];
      user.company = null;
      user.resumes = [];
      await this.userRepository.save(user);
    }

    return await this.userRepository.delete(ids);
  }
}
