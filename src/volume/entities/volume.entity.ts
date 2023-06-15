import { Edition } from '../../edition/entities/edition.entity';
import { Library } from '../../library/entities/library.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Volume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('int')
  number: number;

  @Column('date', { name: 'release_date', nullable: true })
  releaseDate: Date;

  @Column('date', { name: 'create_date' })
  createDate: Date;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('text', { nullable: true })
  resume: string;

  @Column('int', { nullable: true, name: 'nbr_pages' })
  nbrPages: number;

  @Column('float', { nullable: true })
  price: number;

  @Column('boolean', { default: false })
  visibility: boolean;

  @Column('int', { name: 'follow_number', default: 0 })
  followNumber: number;

  @ManyToOne(() => Edition, (edition) => edition.volumes)
  edition: Edition;

  @Column('int', { nullable: true })
  editionId: number;

  @OneToMany(() => Library, (library) => library.volume)
  libraries: Library[];

  @Column('varchar', { nullable: true })
  slug: string;

  volumesCount: number;

  volumeInLibrary: boolean | number;

  volumeInWishList: boolean | number;

  volumeIsRead: boolean;
  //Formatage du slug avant insertion en bdd.
  @BeforeInsert()
  formatSlug() {
    this.title = this.title.trim();
    return (this.slug = this.title.toLowerCase().replace(/\s/g, '-'));
  }
}
