import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

describe('TagService', () => {
  let tagService: TagService;
  let tagRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(tagService).toBeDefined();
  });

  describe('findAll', () => {
    it('it should return an array of tags', async () => {
      jest.spyOn(tagRepository, 'find').mockResolvedValueOnce(valueTag);
      const result = await tagService.findAll();
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
    });

    it('it must generate an error, findAll return an error', async () => {
      jest.spyOn(tagRepository, 'find').mockImplementation(() => {
        throw new Error('async error');
      });
      try {
        await tagService.findAll();
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
