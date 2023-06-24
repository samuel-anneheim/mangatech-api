import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './collection/collection.module';
import { EditionModule } from './edition/edition.module';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { Collection } from './collection/entities/collection.entity';
import { Edition } from './edition/entities/edition.entity';
import { Tag } from './tag/entities/tag.entity';
import { AuthorModule } from './author/author.module';
import { LibraryModule } from './library/library.module';
import { UserModule } from './user/user.module';
import { VolumeModule } from './volume/volume.module';
import { CategoryModule } from './category/category.module';
import { EditorModule } from './editor/editor.module';
import { Author } from './author/entities/author.entity';
import { Library } from './library/entities/library.entity';
import { User } from './user/entities/user.entity';
import { Category } from './category/entities/category.entity';
import { Volume } from './volume/entities/volume.entity';
import { Editor } from './editor/entities/editor.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.MYSQL_HOST,
      port: parseInt(env.MYSQL_PORT),
      username: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DB_NAME,
      entities: [
        Collection,
        Edition,
        Tag,
        Author,
        Library,
        User,
        Category,
        Volume,
        Editor,
      ],
      synchronize: false,
      autoLoadEntities: true,
    }),
    CollectionModule,
    EditionModule,
    TagModule,
    AuthorModule,
    LibraryModule,
    UserModule,
    VolumeModule,
    CategoryModule,
    EditorModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
