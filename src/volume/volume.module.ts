import { forwardRef, Module } from '@nestjs/common';
import { VolumeService } from './volume.service';
import { VolumeController } from './volume.controller';
import { Volume } from './entities/volume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryModule } from '../library/library.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volume]),
    forwardRef(() => LibraryModule),
    UserModule,
  ],
  controllers: [VolumeController],
  providers: [VolumeService],
  exports: [VolumeService],
})
export class VolumeModule {}
