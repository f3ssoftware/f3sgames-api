import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerResponseDto } from './dto/player-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Player } from './player.entity';
import { NotFoundException } from '@nestjs/common';
import { Account } from '../account/account.entity';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  const mockPlayerService = {
    createPlayer: jest.fn(),
    findAllByAccountId: jest.fn(),
    updateTransferableCoins: jest.fn(),
    findByPlayerName: jest.fn(),
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

  describe('updateTransferableCoins', () => {
    it('should update transferable coins for a player', async () => {
      const name = 'TestPlayer';
      const coins = 50;
      const account = new Account();
      account.id = 1;
      account.coins = 100;
      account.coinsTransferable = 100;
      account.name = 'TestAccount';
      account.premDays = 0;
      account.premDaysPurchased = 0;
      account.tournamentCoins = 0;
      account.creation = 0;
      account.recruiter = 0;

      const player = new Player();
      player.id = 1;
      player.name = name;
      player.vocation = 1;
      player.sex = 1;
      player.town_id = 1;
      player.level = 1;
      player.experience = 0;
      player.maglevel = 0;
      player.skill_fist = 10;
      player.skill_club = 10;
      player.skill_sword = 10;
      player.skill_axe = 10;
      player.skill_dist = 10;
      player.skill_shielding = 10;
      player.skill_fishing = 10;
      player.boss_points = 0;
      player.account = account;

      const playerResponseDto = new PlayerResponseDto(player);

      mockPlayerService.updateTransferableCoins.mockResolvedValue(playerResponseDto);

      const result = await controller.updateTransferableCoins(name, coins);
      
      expect(result).toEqual(playerResponseDto);
      expect(mockPlayerService.updateTransferableCoins).toHaveBeenCalledWith(name, coins);
    });

    it('should throw NotFoundException if player is not found', async () => {
      mockPlayerService.updateTransferableCoins.mockRejectedValue(new NotFoundException('Player not found'));

      await expect(controller.updateTransferableCoins('UnknownPlayer', 50)).rejects.toThrow(NotFoundException);
    });
});


  describe('createPlayer', () => {
    it('should create a player', async () => {
      const createPlayerDto: CreatePlayerDto = { name: 'TestPlayer', vocation: 1, sex: 1, town_id: 1 };
      const req = { user: { accountId: 1 } };

      const account = new Account();
      account.id = 1;
      const player = new Player();
      player.account = account;
      player.name = 'TestPlayer';

      mockPlayerService.createPlayer.mockResolvedValue(new PlayerResponseDto(player));

      const result = await controller.createPlayer(createPlayerDto, req);
      expect(result).toEqual(expect.any(PlayerResponseDto));
      expect(mockPlayerService.createPlayer).toHaveBeenCalledWith(createPlayerDto, 1);
    });

    it('should throw an error if account ID is undefined', async () => {
      const createPlayerDto: CreatePlayerDto = { name: 'TestPlayer', vocation: 1, sex: 1, town_id: 1 };
      const req = { user: {} };

      mockPlayerService.createPlayer.mockImplementation(() => {
        throw new NotFoundException('Account ID not found');
      });

      await expect(controller.createPlayer(createPlayerDto, req)).rejects.toThrow('Account ID not found');
    });
  });

  describe('listPlayers', () => {
    it('should return an array of players', async () => {
      const req = { user: { accountId: 1 } };
      mockPlayerService.findAllByAccountId.mockResolvedValue([]);

      const result = await controller.listPlayers(req);
      expect(result).toEqual([]);
      expect(mockPlayerService.findAllByAccountId).toHaveBeenCalledWith(1);
    });

    it('should throw an error if account ID is undefined', async () => {
      const req = { user: {} };

      await expect(controller.listPlayers(req)).rejects.toThrow('Account ID not found');
    });
  });

  describe('getPlayerByName', () => {
    it('should return a player when found', async () => {
      const player = new Player();
      mockPlayerService.findByPlayerName.mockResolvedValue(player);

      const result = await controller.getPlayerByName('TestPlayer');
      expect(result).toEqual(player);
      expect(service.findByPlayerName).toHaveBeenCalledWith('TestPlayer');
    });

    it('should throw NotFoundException if player not found', async () => {
      mockPlayerService.findByPlayerName.mockResolvedValue(undefined);

      await expect(controller.getPlayerByName('UnknownPlayer')).rejects.toThrow('Player not found');
      expect(service.findByPlayerName).toHaveBeenCalledWith('UnknownPlayer');
    });
  });
});

