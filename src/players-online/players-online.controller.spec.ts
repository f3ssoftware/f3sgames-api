import { Test, TestingModule } from '@nestjs/testing';
import { PlayersOnlineController } from './players-online.controller';
import { PlayersOnlineService } from './players-online.service';
import { PlayersOnline } from './entities/players-online.entity';

describe('PlayersOnlineController', () => {
  let controller: PlayersOnlineController;
  let service: PlayersOnlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersOnlineController],
      providers: [
        {
          provide: PlayersOnlineService,
          useValue: {
            findAllPlayersOnline: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayersOnlineController>(PlayersOnlineController);
    service = module.get<PlayersOnlineService>(PlayersOnlineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of players online', async () => {
      const playersOnline = [{ player: { name: 'TestPlayer' } }] as PlayersOnline[];
      jest.spyOn(service, 'findAllPlayersOnline').mockResolvedValue(playersOnline);

      const result = await controller.findAll();
      expect(result).toEqual(playersOnline);
      expect(service.findAllPlayersOnline).toHaveBeenCalled();
    });

    it('should return undefined if no players are found', async () => {
      jest.spyOn(service, 'findAllPlayersOnline').mockResolvedValue(undefined);

      const result = await controller.findAll();
      expect(result).toBeUndefined();
      expect(service.findAllPlayersOnline).toHaveBeenCalled();
    });
  });
});
