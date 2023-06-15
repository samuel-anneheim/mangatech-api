import { Module } from '@nestjs/common';
import { EditorService } from './editor.service';
import { EditorController } from './editor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Editor } from './entities/editor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Editor])],
  controllers: [EditorController],
  providers: [EditorService],
})
export class EditorModule {}
