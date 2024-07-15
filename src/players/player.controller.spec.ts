import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerResponseDto } from './dto/player-response.dto';
import { AuthGuard } from '@nestjs/passport';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  const mockPlayerService = {
    createPlayer: jest.fn((dto, accountId) => {
      return { id: Date.now(), ...dto, accountId } as PlayerResponseDto;
    }),
    findAllByAccountId: jest.fn((accountId) => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPlayer', () => {
    it('should create a player', async () => {
      const createPlayerDto: CreatePlayerDto = { name: 'TestPlayer', vocation: 1, sex: 1, town_id: 1 };
      const req = { user: { accountId: 1 } };

      const result = await controller.createPlayer(createPlayerDto, req);
      expect(result).toEqual(expect.objectContaining({ name: 'TestPlayer' }));
      expect(mockPlayerService.createPlayer).toHaveBeenCalledWith(createPlayerDto, 1);
    });
  });

  describe('listPlayers', () => {
    it('should return an array of players', async () => {
      const req = { user: { accountId: 1 } };

      const result = await controller.listPlayers(req);
      expect(result).toEqual([]);
      expect(mockPlayerService.findAllByAccountId).toHaveBeenCalledWith(1);
    });
  });
});
