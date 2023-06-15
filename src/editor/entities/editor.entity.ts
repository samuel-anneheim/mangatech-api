import { Collection } from '../../collection/entities/collection.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Editor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  logo: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { nullable: true, name: 'official_website' })
  officialWebsite: string;

  @OneToMany(() => Collection, (collection) => collection.editor)
  collections: Collection[];

  @Column('varchar', { nullable: true })
  slug: string;

  //Formatage du slug avant insertion en bdd.
  @BeforeInsert()
  formatSlug() {
    this.name = this.name.trim();
    return (this.slug = this.name.toLowerCase().replace(/\s/g, '-'));
  }
}
