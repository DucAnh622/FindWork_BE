import UserEntity from 'src/Entity/userEntity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import JobEntity from './job.entity';

@Entity('resumes')
export default class ResumeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameCV: string;

  @Column()
  template: string;

  @Column()
  url: string;

  @Column()
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.resumes)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToMany(() => JobEntity, (job) => job.resumes)
  @JoinTable({
    name: 'resume_jobs',
    joinColumn: { name: 'resumeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'jobId', referencedColumnName: 'id' },
  })
  jobs: JobEntity[];

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
