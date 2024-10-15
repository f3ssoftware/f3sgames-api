import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersOnlineService } from './players-online.service';
import { PlayersOnline } from './entities/players-online.entity';

describe('PlayersOnlineService', () => {
  let service: PlayersOnlineService;
  let repository: Repository<PlayersOnline>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersOnlineService,
        {
          provide: getRepositoryToken(PlayersOnline, 'gameConnection'),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlayersOnlineService>(PlayersOnlineService);
    repository = module.get<Repository<PlayersOnline>>(getRepositoryToken(PlayersOnline, 'gameConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPlayersOnline', () => {
    it('should return an array of players online', async () => {
      const playersOnline = [{ player: { name: 'TestPlayer' } }] as PlayersOnline[];
      jest.spyOn(repository, 'find').mockResolvedValue(playersOnline);

      const result = await service.findAllPlayersOnline();
      expect(result).toEqual(playersOnline);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['player'],
        select: ['player'],
      });
    });

    it('should return undefined if no players are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(undefined);

      const result = await service.findAllPlayersOnline();
      expect(result).toBeUndefined();
    });
  });
});
