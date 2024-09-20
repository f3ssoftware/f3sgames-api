import { Test, TestingModule } from '@nestjs/testing';
import { NewsPostController } from './news-post.controller';
import { NewsService } from './news-post.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsCategoryEnum } from './enum/news-category.enum';
import { NewsPost } from './news-post.entity';

const mockNewsService = {
  createNews: jest.fn(dto => Promise.resolve({ id: 'uuid', ...dto })),
  findAllNews: jest.fn().mockResolvedValue([]),
  deleteNewsById: jest.fn().mockResolvedValue(undefined),
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

  it('should get all news posts', async () => {
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
    jest.spyOn(service, 'findAllNews').mockResolvedValueOnce(newsPosts);
  
    expect(await controller.findAllNews()).toEqual(newsPosts);
    expect(service.findAllNews).toHaveBeenCalled();
  });

  it('should delete a news post by ID', async () => {
    const id = 'uuid';
    expect(await controller.deleteNewsById(id)).toBeUndefined();
    expect(service.deleteNewsById).toHaveBeenCalledWith(id);
  });

  it('should throw an error if news post to delete is not found', async () => {
    jest.spyOn(service, 'deleteNewsById').mockRejectedValueOnce(new Error('News post not found'));

    await expect(controller.deleteNewsById('invalid-id')).rejects.toThrowError('News post not found');
    expect(service.deleteNewsById).toHaveBeenCalledWith('invalid-id');
  });
});
