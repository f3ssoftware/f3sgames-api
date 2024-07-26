import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsService } from './news-post.service';
import { NewsPost } from './news-post.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsCategoryEnum } from './enum/news-category.enum';

const mockNewsPostRepository = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(news => Promise.resolve({ id: 'uuid', ...news }))
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
});
