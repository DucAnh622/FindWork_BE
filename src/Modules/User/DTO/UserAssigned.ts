import { IsNotEmpty, IsNumber} from 'class-validator';

export class UserAssignedDTO {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  roleIds: [];
}
