import { forwardRef, Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { Library } from './entities/library.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { VolumeModule } from '../volume/volume.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Library]),
    UserModule,
    forwardRef(() => VolumeModule),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
