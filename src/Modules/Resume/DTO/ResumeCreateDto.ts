import { IsNotEmpty } from 'class-validator';

export class ResumeCreateDto {
  @IsNotEmpty()
  nameCV: string;
  @IsNotEmpty()
  template: string;
  url: string;
  @IsNotEmpty()
  status: string;
  jobs: [];
}
