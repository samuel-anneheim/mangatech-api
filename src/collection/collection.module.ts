import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection } from './entities/collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edition } from '../edition/entities/edition.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Edition, Tag, Category])],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
