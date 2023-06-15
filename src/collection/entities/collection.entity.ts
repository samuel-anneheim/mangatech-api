import { Edition } from '../../edition/entities/edition.entity';
import { Tag } from '../../tag/entities/tag.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import { Editor } from '../../editor/entities/editor.entity';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  title: string;

  @Column('varchar', { nullable: true })
  slug: string;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('date', { name: 'release_date', nullable: true })
  releaseDate: string;

  @Column('date', { name: 'create_date' })
  createDate: string;

  @Column('boolean', { name: 'is_finish', nullable: true, default: false })
  isFinish: boolean;

  @Column('boolean', { default: false })
  visibility: boolean;

  @Column('text', { nullable: true })
  resume: string;

  @Column('int', { name: 'follow_number', default: 0 })
  followNumber: number;

  @ManyToOne(() => Author, (author) => author.collections)
  author: Author;

  @ManyToOne(() => Category, (category) => category.collections)
  category: Category;

  @ManyToOne(() => Editor, (editor) => editor.collections)
  editor: Editor;

  @OneToMany(() => Edition, (edition) => edition.collection)
  editions: Edition[];

  @ManyToMany(() => Tag, (tag) => tag.collections)
  @JoinTable()
  tags: Tag[];

  @Column({ type: 'int', nullable: true })
  authorId: number;

  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @Column({ type: 'int', nullable: true })
  editorId: number;

  tagsId?: number[];

  //Formatage du slug avant insertion en bdd.
  @BeforeInsert()
  formatSlug() {
    this.title = this.title.trim();
    return (this.slug = this.title.toLowerCase().replace(/\s/g, '-'));
  }
}
