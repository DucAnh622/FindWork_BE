import { IsNotEmpty } from 'class-validator';

export class ResumeUpdateDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  nameCV: string;
  @IsNotEmpty()
  template: string;
  url: string;
  @IsNotEmpty()
  status: string;
  jobs: [];
}
