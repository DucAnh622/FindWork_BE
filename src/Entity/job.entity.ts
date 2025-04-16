import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import CompanyEntity from './company.entity';
import ResumeEntity from './resume.entity';
import SkillEntity from './skill.entity';

@Entity('jobs')
export default class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CompanyEntity, (company) => company.jobs,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity | null;

  @ManyToMany(() => ResumeEntity, (resume) => resume.jobs, { onDelete: 'CASCADE' })
  resumes: ResumeEntity[];

  @ManyToMany(() => SkillEntity, (skill) => skill.jobs, { onDelete: 'CASCADE' })
  skills: SkillEntity[];

  @Column({default:1})
  quantity:number;

  @Column({type:'text'})
  description: string;

  @Column()
  level:string;

  @Column()
  address: string;

  @Column()
  experience: string;

  @Column()
  step: string;

  @Column()
  workTime: string;

  @Column()
  workDay: string;

  @Column()
  salary: string;

  @Column()
  education: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  isActive: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;

  @Column()
  deleteBy: number;
}
