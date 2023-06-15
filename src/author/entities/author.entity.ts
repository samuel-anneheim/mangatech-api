import { Collection } from '../../collection/entities/collection.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false })
  surname: string;

  @Column('varchar', { nullable: true })
  gender: string;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('varchar', { nullable: true })
  slug: string;

  @Column('text', { nullable: true })
  biography: string;

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth: Date | null;

  @OneToMany(() => Collection, (collection) => collection.author)
  collections: Collection[];

  // Formatage du slug avant insertion en bdd.
  @BeforeInsert()
  formatSlug() {
    if (!this.name || !this.surname) {
      return;
    }
    this.name = this.name.trim();
    this.surname = this.surname.trim();
    return (this.slug =
      this.name.toLowerCase().replace(/\s/g, '-') +
      '-' +
      this.surname.toLowerCase().replace(/\s/g, '-'));
  }
}
