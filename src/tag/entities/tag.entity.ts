import { Collection } from '../../collection/entities/collection.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToMany(() => Collection, (collection) => collection.tags)
  collections: Collection[];
}
