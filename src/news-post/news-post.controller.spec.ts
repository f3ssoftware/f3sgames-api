import { Test, TestingModule } from '@nestjs/testing';
import { NewsPostController } from './news-post.controller';
import { NewsService } from './news-post.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsCategoryEnum } from './enum/news-category.enum';

const mockNewsService = {
  createNews: jest.fn(dto => Promise.resolve({ id: 'uuid', ...dto })),
};

describe('NewsPostController', () => {
  let controller: NewsPostController;
  let service: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsPostController],
      providers: [
        {
          provide: NewsService,
          useValue: mockNewsService,
        },
      ],
    }).compile();

    controller = module.get<NewsPostController>(NewsPostController);
    service = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    expect(await controller.createNews(createNewsDto)).toEqual({
      id: 'uuid',
      ...createNewsDto,
    });

    expect(service.createNews).toHaveBeenCalledWith(createNewsDto);
  });
});
