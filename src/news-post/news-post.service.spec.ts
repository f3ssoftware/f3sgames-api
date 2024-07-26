import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { NewsService } from './news-post.service';
import { NewsPost } from './news-post.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsCategoryEnum } from './enum/news-category.enum';

const mockNewsPostRepository = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(news => Promise.resolve({ id: 'uuid', ...news })),
  find: jest.fn().mockResolvedValue([]),
  delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] } as DeleteResult),
};

describe('NewsService', () => {
  let service: NewsService;
  let repository: Repository<NewsPost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(NewsPost, 'paymentConnection'),
          useValue: mockNewsPostRepository,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    repository = module.get<Repository<NewsPost>>(getRepositoryToken(NewsPost, 'paymentConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a news post', async () => {
    const createNewsDto: CreateNewsDto = {
      title: 'Test Title',
      body: 'Test Body',
      category: NewsCategoryEnum.POST,
      article_text: 'Test Article Text',
      article_image: 'test_image.jpg',
      enabled: true,
    };

    expect(await service.createNews(createNewsDto)).toEqual({
      id: 'uuid',
      ...createNewsDto,
    });

    expect(repository.create).toHaveBeenCalledWith(createNewsDto);
    expect(repository.save).toHaveBeenCalledWith(createNewsDto);
  });

  it('should find all news posts', async () => {
    const newsPosts: NewsPost[] = [
      {
        id: 'uuid',
        title: 'Test Title',
        body: 'Test Body',
        category: NewsCategoryEnum.POST,
        article_text: 'Test Article Text',
        article_image: 'test_image.jpg',
        enabled: true,
        created_at: new Date(),
      },
    ];
    jest.spyOn(repository, 'find').mockResolvedValueOnce(newsPosts);
  
    expect(await service.findAllNews()).toEqual(newsPosts);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should delete a news post by ID', async () => {
    const deleteResult: DeleteResult = { affected: 1, raw: [] };
    jest.spyOn(repository, 'delete').mockResolvedValueOnce(deleteResult);
  
    const result = await service.deleteNewsById('uuid');
    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('uuid');
  });
  
  it('should throw an error if news post to delete is not found', async () => {
    const deleteResult: DeleteResult = { affected: 0, raw: [] };
    jest.spyOn(repository, 'delete').mockResolvedValueOnce(deleteResult);
  
    await expect(service.deleteNewsById('invalid-id')).rejects.toThrowError('News post with ID "invalid-id" not found');
    expect(repository.delete).toHaveBeenCalledWith('invalid-id');
  });

});
