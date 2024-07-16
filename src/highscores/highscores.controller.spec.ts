import { Test, TestingModule } from '@nestjs/testing';
import { HighscoresController } from './highscores.controller';
import { HighscoresService } from './highscores.service';
import { VocationFilter } from './dto/vocationFilter.dto';
import { Category } from './enum/category.enum';
import { Vocation } from '../players/enums/vocations.enum';

describe('HighscoresController', () => {
  let controller: HighscoresController;
  let service: HighscoresService;

  const mockHighscoresService = {
    getHighscores: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HighscoresController],
      providers: [
        {
          provide: HighscoresService,
          useValue: mockHighscoresService,
        },
      ],
    }).compile();

    controller = module.get<HighscoresController>(HighscoresController);
    service = module.get<HighscoresService>(HighscoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHighscores', () => {
    it('should return highscores with a valid category and vocation', async () => {
      const mockHighscores = [
        { rank: 1, name: 'Player1', vocation: 'Sorcerer', level: 100, skillLevel: 5000 },
        { rank: 2, name: 'Player2', vocation: 'Sorcerer', level: 90, skillLevel: 4500 },
      ];
      mockHighscoresService.getHighscores.mockResolvedValue(mockHighscores);

      const result = await controller.getHighscores(Category.experience, VocationFilter.Sorcerer, 10);

      expect(result).toEqual(mockHighscores);
      expect(service.getHighscores).toHaveBeenCalledWith(Category.experience, Vocation.Sorcerer, 10);
    });

    it('should default vocation to "All" when not provided', async () => {
      const mockHighscores = [
        { rank: 1, name: 'Player1', vocation: 'Sorcerer', level: 100, skillLevel: 5000 },
        { rank: 2, name: 'Player2', vocation: 'Sorcerer', level: 90, skillLevel: 4500 },
      ];
      mockHighscoresService.getHighscores.mockResolvedValue(mockHighscores);

      const result = await controller.getHighscores(Category.experience, VocationFilter.All, 10);

      expect(result).toEqual(mockHighscores);
      expect(service.getHighscores).toHaveBeenCalledWith(Category.experience, 'All', 10);
    });

    it('should limit the number of highscores to a maximum of 1000', async () => {
      const mockHighscores = Array(1000).fill({
        rank: 1,
        name: 'Player1',
        vocation: 'Sorcerer',
        level: 100,
        skillLevel: 5000,
      });
      mockHighscoresService.getHighscores.mockResolvedValue(mockHighscores);

      const result = await controller.getHighscores(Category.experience, VocationFilter.Sorcerer, 1500);

      expect(result.length).toBe(1000);
      expect(service.getHighscores).toHaveBeenCalledWith(Category.experience, Vocation.Sorcerer, 1000);
    });

    it('should limit the number of highscores to a minimum of 10', async () => {
      const mockHighscores = Array(10).fill({
        rank: 1,
        name: 'Player1',
        vocation: 'Sorcerer',
        level: 100,
        skillLevel: 5000,
      });
      mockHighscoresService.getHighscores.mockResolvedValue(mockHighscores);

      const result = await controller.getHighscores(Category.experience, VocationFilter.Sorcerer, 5);

      expect(result.length).toBe(10);
      expect(service.getHighscores).toHaveBeenCalledWith(Category.experience, Vocation.Sorcerer, 10);
    });
  });

  describe('mapVocationFilterToNumber', () => {
    it('should return the correct vocation number for each VocationFilter', () => {
      expect(controller['mapVocationFilterToNumber'](VocationFilter.All)).toBe('All');
      expect(controller['mapVocationFilterToNumber'](VocationFilter.None)).toBe(Vocation.None);
      expect(controller['mapVocationFilterToNumber'](VocationFilter.Sorcerer)).toBe(Vocation.Sorcerer);
      expect(controller['mapVocationFilterToNumber'](VocationFilter.Druid)).toBe(Vocation.Druid);
      expect(controller['mapVocationFilterToNumber'](VocationFilter.Paladin)).toBe(Vocation.Paladin);
      expect(controller['mapVocationFilterToNumber'](VocationFilter.Knight)).toBe(Vocation.Knight);
    });

    it('should return "All" for an unknown VocationFilter', () => {
      expect(controller['mapVocationFilterToNumber']('Unknown' as VocationFilter)).toBe('All');
    });
  });
});
