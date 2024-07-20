import { Test, TestingModule } from '@nestjs/testing';
import { NewsTickerController } from './news-ticker.controller';
import { NewsTickerService } from './news-ticker.service';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';
import { AuthGuard } from '@nestjs/passport';

describe('NewsTickerController', () => {
  let controller: NewsTickerController;
  let service: NewsTickerService;

  const mockNewsTicker = {
    id: 1,
    createdAt: new Date(),
    title: 'Test Title',
    author: 'Test Author',
    description: 'Test Description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsTickerController],
      providers: [
        {
          provide: NewsTickerService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockNewsTicker),
            findAll: jest.fn().mockResolvedValue([mockNewsTicker]),
            findOne: jest.fn().mockResolvedValue(mockNewsTicker),
            update: jest.fn().mockResolvedValue(mockNewsTicker),
            remove: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<NewsTickerController>(NewsTickerController);
    service = module.get<NewsTickerService>(NewsTickerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a news ticker', async () => {
      const dto: CreateNewsTickerDto = {
        title: 'Test Title',
        author: 'Test Author',
        description: 'Test Description',
      };
      expect(await controller.create(dto)).toEqual(mockNewsTicker);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of news tickers', async () => {
      expect(await controller.findAll()).toEqual([mockNewsTicker]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single news ticker', async () => {
      expect(await controller.findOne(1)).toEqual(mockNewsTicker);
      expect(service.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a news ticker', async () => {
      const dto: UpdateNewsTickerDto = {
        title: 'Updated Title',
        author: 'Updated Author',
        description: 'Updated Description',
      };
      expect(await controller.update(1, dto)).toEqual(mockNewsTicker);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a news ticker', async () => {
      expect(await controller.remove(1)).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
