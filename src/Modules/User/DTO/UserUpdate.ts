import { IsNotEmpty } from 'class-validator';
import { UserRegister } from './UserRegister';
import { OmitType } from '@nestjs/mapped-types';

export class UserUpdate extends OmitType(UserRegister, ['password'] as const) {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  roleIds: [];
  status: string;
}
