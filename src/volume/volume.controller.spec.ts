import { Test, TestingModule } from '@nestjs/testing';
import { VolumeController } from './volume.controller';
import { VolumeService } from './volume.service';

describe('VolumeController', () => {
  let controller: VolumeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolumeController],
      providers: [VolumeService],
    }).compile();

    controller = module.get<VolumeController>(VolumeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
