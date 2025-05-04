import { IsNotEmpty } from 'class-validator';

export class CompanyCreate {
  @IsNotEmpty()
  name: string;
  image: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  specialityId: number;
  @IsNotEmpty()
  phone: string;
}
