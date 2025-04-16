import { IsNotEmpty } from 'class-validator';

export class JobUpdateDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  experience: string;
  @IsNotEmpty()
  salary: string;
  @IsNotEmpty()
  companyId: number;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  education: string;
  @IsNotEmpty()
  step: string;
  @IsNotEmpty()
  workTime: string;
  @IsNotEmpty()
  workDay: string;
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  endDate: Date;
  skills: [];
}
