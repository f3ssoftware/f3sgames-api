import { Test, TestingModule } from '@nestjs/testing';
import { HighscoresService } from './highscores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../players/player.entity';
import { Repository } from 'typeorm';
import { Vocation } from '../players/enums/vocations.enum';
import { Category } from './enum/category.enum';

describe('HighscoresService', () => {
  let service: HighscoresService;
  let playerRepository: Repository<Player>;

  const mockPlayerRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HighscoresService,
        {
          provide: getRepositoryToken(Player, 'gameConnection'),
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<HighscoresService>(HighscoresService);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player, 'gameConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVocations', () => {
    it('should return all vocations when vocation is "All"', () => {
      const result = service['getVocations']('All');
      expect(result).toEqual(Object.values(Vocation).filter((value) => typeof value === 'number') as number[]);
    });

    it('should return correct vocations for Sorcerer', () => {
      const result = service['getVocations'](Vocation.Sorcerer);
      expect(result).toEqual([Vocation.Sorcerer, Vocation.MasterSorcerer]);
    });

    it('should return correct vocations for Druid', () => {
      const result = service['getVocations'](Vocation.Druid);
      expect(result).toEqual([Vocation.Druid, Vocation.ElderDruid]);
    });

    it('should return correct vocations for Paladin', () => {
      const result = service['getVocations'](Vocation.Paladin);
      expect(result).toEqual([Vocation.Paladin, Vocation.RoyalPaladin]);
    });

    it('should return correct vocations for Knight', () => {
      const result = service['getVocations'](Vocation.Knight);
      expect(result).toEqual([Vocation.Knight, Vocation.EliteKnight]);
    });

    it('should return the input vocation if it does not match any specific case', () => {
      const result = service['getVocations'](Vocation.None);
      expect(result).toEqual([Vocation.None]);
    });
  });

  describe('getHighscores', () => {
    it('should return the correct highscores for a given category and vocation', async () => {
      mockPlayerRepository.getMany.mockResolvedValue([
        { id: 1, name: 'Player1', vocation: Vocation.Sorcerer, level: 100, experience: 5000 },
        { id: 2, name: 'Player2', vocation: Vocation.Sorcerer, level: 90, experience: 4500 },
      ]);

      const result = await service.getHighscores(Category.experience, Vocation.Sorcerer, 2);
      expect(result).toEqual([
        { rank: 1, name: 'Player1', vocation: 'Sorcerer', level: 100, skillLevel: 5000 },
        { rank: 2, name: 'Player2', vocation: 'Sorcerer', level: 90, skillLevel: 4500 },
      ]);

      expect(mockPlayerRepository.where).toHaveBeenCalledWith('player.vocation IN (:...vocations)', { vocations: [Vocation.Sorcerer, Vocation.MasterSorcerer] });
      expect(mockPlayerRepository.orderBy).toHaveBeenCalledWith('player.experience', 'DESC');
      expect(mockPlayerRepository.limit).toHaveBeenCalledWith(2);
    });

    // Add more tests for different categories and vocations if needed
    it('should return the correct highscores for all vocations', async () => {
      mockPlayerRepository.getMany.mockResolvedValue([
        { id: 1, name: 'Player1', vocation: Vocation.Sorcerer, level: 100, experience: 5000 },
        { id: 2, name: 'Player2', vocation: Vocation.Knight, level: 90, experience: 4500 },
      ]);

      const result = await service.getHighscores(Category.experience, 'All', 2);
      expect(result).toEqual([
        { rank: 1, name: 'Player1', vocation: 'Sorcerer', level: 100, skillLevel: 5000 },
        { rank: 2, name: 'Player2', vocation: 'Knight', level: 90, skillLevel: 4500 },
      ]);

      expect(mockPlayerRepository.orderBy).toHaveBeenCalledWith('player.experience', 'DESC');
      expect(mockPlayerRepository.limit).toHaveBeenCalledWith(2);
    });
  });
});
