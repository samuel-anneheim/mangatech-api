import { Collection } from '../../collection/entities/collection.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Volume } from '../../volume/entities/volume.entity';

@Entity()
export class Edition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @ManyToOne(() => Collection, (collection) => collection.editions)
  collection: Collection;

  @OneToMany(() => Volume, (volume) => volume.edition)
  volumes: Volume[];

  @Column({ type: 'int', nullable: true })
  collectionId: number;

  @Column('varchar', { nullable: true })
  slug: string;

  volumesCount: number;

  //Formatage du slug avant insertion en bdd.
  @BeforeInsert()
  formatSlug() {
    this.name = this.name.trim();
    return (this.slug = this.name.toLowerCase().replace(/\s/g, '-'));
  }
}
