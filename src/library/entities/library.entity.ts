import { Volume } from '../../volume/entities/volume.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Library {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', { name: 'is_read', default: false })
  isRead: boolean;

  @ManyToOne(() => Volume, (volume) => volume.libraries)
  volume: Volume;

  @ManyToOne(() => User, (user) => user.libraries)
  user: User;

  @Column({ type: 'int', nullable: true })
  volumeId: number;

  @Column({ type: 'int', nullable: true })
  userId: number;
}
