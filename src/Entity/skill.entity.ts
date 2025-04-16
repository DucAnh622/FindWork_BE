import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import JobEntity from './job.entity';
import SubcriberEntity from './subcribers.entity';
import CompanyEntity from './company.entity';

@Entity('skills')
export default class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => JobEntity, (job) => job.skills)
  @JoinTable({
    name: 'skill_jobs',
    joinColumn: { name: 'skillId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'jobId', referencedColumnName: 'id' },
  })
  jobs: JobEntity[];

  @ManyToOne(() => SubcriberEntity, (subcriber) => subcriber.skills)
  @JoinColumn({ name: 'subcriberId' })
  subcriber: SubcriberEntity;

  @Column()
  isActive: boolean;

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
  deletedBy: number;
}
