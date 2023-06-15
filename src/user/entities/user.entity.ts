import { Library } from '../../library/entities/library.entity';
import { Volume } from '../../volume/entities/volume.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../auth/role/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true })
  surname: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @Column('varchar', { nullable: true })
  picture: string;

  @Column('date', { name: 'registration_date' })
  registrationDate: Date;

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Column('enum', { enum: Role, default: Role.User })
  role: Role;

  @Column('int', { default: 0, name: 'count_volume' })
  countVolume: number;

  @Column('int', { default: 0, name: 'count_volume_read' })
  countVolumeRead: number;

  @Column('varchar', { nullable: true })
  gender: string;

  @OneToMany(() => Library, (library) => library.user)
  libraries: Library[];

  @ManyToMany(() => Volume)
  @JoinTable({ name: 'whish_list' })
  wishList: Volume[];
}
