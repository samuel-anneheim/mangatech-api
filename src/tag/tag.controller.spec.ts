import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useFactory: () => ({
            findAll: jest.fn(() => Promise.resolve(valueTag)),
          }),
        },
      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const tag: Tag[] = await tagController.findAll();
      expect(tag).toBeDefined();
      expect(tag.length).toEqual(1);
    });

    it('it calling findAll abd receive a specific error', async () => {
      jest.spyOn(TagController.prototype, 'findAll').mockImplementation(() => {
        throw new Error('async error');
      });
      try {
        await tagController.findAll();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('async error');
      }
    });
  });
});

const valueTag: Tag[] = [
  {
    id: 1,
    name: 'Tag',
    collections: [],
  },
];
