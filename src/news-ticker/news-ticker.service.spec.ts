import { Test, TestingModule } from '@nestjs/testing';
import { NewsTickerService } from './news-ticker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsTicker } from './entities/news-ticker.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

describe('NewsTickerService', () => {
  let service: NewsTickerService;
  let repository: Repository<NewsTicker>;

  const mockNewsTicker = {
    id: 1,
    createdAt: new Date(),
    title: 'Test Title',
    author: 'Test Author',
    description: 'Test Description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsTickerService,
        {
          provide: getRepositoryToken(NewsTicker, 'paymentConnection'),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NewsTickerService>(NewsTickerService);
    repository = module.get<Repository<NewsTicker>>(getRepositoryToken(NewsTicker, 'paymentConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new news ticker', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockNewsTicker as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockNewsTicker as any);

      expect(await service.create(mockNewsTicker as any)).toEqual(mockNewsTicker);
      expect(repository.create).toHaveBeenCalledWith(mockNewsTicker);
      expect(repository.save).toHaveBeenCalledWith(mockNewsTicker);
    });
  });

  describe('findAll', () => {
    it('should return an array of news tickers', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockNewsTicker] as any);

      expect(await service.findAll()).toEqual([mockNewsTicker]);
      expect(repository.find).toHaveBeenCalledWith({
        select: ['id', 'createdAt', 'title', 'author', 'description'],
      });
    });
  });

  describe('findOne', () => {
    it('should find and return a news ticker', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockNewsTicker as any);

      expect(await service.findOne({ where: { id: 1 } })).toEqual(mockNewsTicker);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error('Not found'));

      await expect(service.findOne({ where: { id: 1 } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a news ticker', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNewsTicker as any);
      jest.spyOn(repository, 'merge').mockReturnValue(mockNewsTicker as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockNewsTicker as any);

      expect(await service.update(1, mockNewsTicker as any)).toEqual(mockNewsTicker);
      expect(service.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(mockNewsTicker, mockNewsTicker);
      expect(repository.save).toHaveBeenCalledWith(mockNewsTicker);
    });
  });

  describe('remove', () => {
    it('should remove a news ticker', async () => {
      const mockUpdateResult: UpdateResult = {
        raw: {},
        affected: 1,
        generatedMaps: [],
      };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNewsTicker as any);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(mockUpdateResult);
  
      expect(await service.remove(1)).toEqual(mockUpdateResult);
      expect(service.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });
  
});
