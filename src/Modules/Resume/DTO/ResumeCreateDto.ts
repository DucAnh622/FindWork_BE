import { IsNotEmpty } from 'class-validator';

export class ResumeCreateDto {
  @IsNotEmpty()
  nameCV: string;
  @IsNotEmpty()
  template: string;
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  status: string;
  jobs: [];
}
