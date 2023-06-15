import { Collection } from '../../collection/entities/collection.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { nullable: true })
  image: string;

  @OneToMany(() => Collection, (collection) => collection.category)
  collections: Collection[];

  //Formatage du slug avant insertion en bdd.
  @BeforeInsert()
  formatSlug() {
    this.name = this.name.trim();
    return (this.slug = this.name.toLowerCase().replace(/\s/g, '-'));
  }
}
