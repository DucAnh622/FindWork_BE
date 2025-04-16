import UserEntity from 'src/Entity/userEntity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import JobEntity from './job.entity';
import SpecialityEntity from './speciality.entity';
import SkillEntity from './skill.entity';

@Entity('companies')
export default class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @ManyToOne(() => SpecialityEntity, (speciality) => speciality.id)
  @JoinColumn({ name: 'specialityId' })
  speciality: SpecialityEntity | null;

  @Column()
  phone: string;

  @OneToMany(() => UserEntity, (user) => user.company)
  users: UserEntity[];

  @OneToMany(() => JobEntity, (job) => job.company)
  jobs: JobEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: "new" })
  status: string;

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
