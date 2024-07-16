import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { Account } from '../account/account.entity';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { NotFoundException } from '@nestjs/common';
import { PlayerResponseDto } from './dto/player-response.dto';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepository: Repository<Player>;
  let accountRepository: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player, 'gameConnection'),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),  // Incluindo o método `find`
          },
        },
        {
          provide: getRepositoryToken(Account, 'gameConnection'),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player, 'gameConnection'));
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account, 'gameConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPlayer', () => {
    it('should create and return a player', async () => {
      const createPlayerDto: CreatePlayerDto = { name: 'TestPlayer', vocation: 1, sex: 1, town_id: 1 };
      const account = new Account();
      account.id = 1;

      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(account);
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(playerRepository, 'save').mockResolvedValue({ ...createPlayerDto, account, id: 1 } as Player);

      const result = await service.createPlayer(createPlayerDto, 1);
      expect(result).toEqual(expect.objectContaining({ name: 'TestPlayer' }));
    });

    it('should throw a conflict exception if player name already exists', async () => {
      const createPlayerDto: CreatePlayerDto = { name: 'TestPlayer', vocation: 1, sex: 1, town_id: 1 };
      const player = new Player();
      player.name = 'TestPlayer';

      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player);

      await expect(service.createPlayer(createPlayerDto, 1)).rejects.toThrow('Player with this name already exists');
    });

    it('should throw an exception if the account is not found', async () => {
      const createPlayerDto: CreatePlayerDto = { name: 'TestPlayer', vocation: 1, sex: 1, town_id: 1 };
  
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(undefined);
  
      await expect(service.createPlayer(createPlayerDto, 99)).rejects.toThrow('Account not found');
      expect(accountRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
    });
  });

  describe('findByPlayerName', () => {
    it('should return a player when found', async () => {
      const player = new Player(); // This is needed in order to manipulate the playerRepository

      jest.spyOn(playerRepository, 'findOne').mockImplementation(async (object) => {
        const where = object.where as { name: string };
        // Return the player if the name is 'TestName'
        return where.name === 'TestName' ? player : undefined;
      });

      const result = await service.findByPlayerName('TestName');
      // Verify if the result is equal to the player instance
      expect(result).toEqual(player);
      // Verify if the repository was called with the correct parameters
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'TestName' },
      });
    });

    it('should return undefined when player not found', async () => {
      jest.spyOn(playerRepository, 'findOne').mockImplementation(async (object) => {
        const where = object.where as { name: string };
        // Return undefined if the name is not 'TestName'
        return where.name === 'TestName' ? new Player() : undefined;
      });

      const result = await service.findByPlayerName('UnknownPlayer');
      // Verify if the result is undefined when the player is not found
      expect(result).toBeUndefined();
      // Verify if the repository was called with the correct parameters
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'UnknownPlayer' },
      });
    });
  });

  describe('findAllByAccountId', () => {
    it('should return an array of players for the given account ID', async () => {
      const account1 = new Account();
      account1.id = 1;

      const account2 = new Account();
      account2.id = 2;

      const players = [
        { id: 1, name: 'Player1', vocation: 1, level: 10, account: account1 },
        { id: 2, name: 'Player2', vocation: 2, level: 20, account: account1 },
        { id: 3, name: 'Player3', vocation: 3, level: 30, account: account2 },
      ] as Player[];

      jest.spyOn(accountRepository, 'findOne').mockImplementation(async (options) => {
        const where = options.where as { id: number };
        return where.id === 1 ? account1 : where.id === 2 ? account2 : undefined;
      });

      jest.spyOn(playerRepository, 'find').mockImplementation(async (options) => {
        const where = options.where as { account: { id: number } };
        return players.filter(player => player.account.id === where.account.id);
      });

      const result = await service.findAllByAccountId(1);
      expect(result).toEqual(players.filter(player => player.account.id === 1));
      expect(playerRepository.find).toHaveBeenCalledWith({
        where: { account: { id: 1 } },
        select: ['id', 'name', 'vocation', 'level'],
      });

      const result2 = await service.findAllByAccountId(2);
      expect(result2).toEqual(players.filter(player => player.account.id === 2));
      expect(playerRepository.find).toHaveBeenCalledWith({
        where: { account: { id: 2 } },
        select: ['id', 'name', 'vocation', 'level'],
      });
    });

    it('should throw an exception if the account is not found', async () => {
      jest.spyOn(accountRepository, 'findOne').mockImplementation(async (options) => {
        const where = options.where as { id: number };
        return where.id === 1 || where.id === 2 ? new Account() : undefined;
      });

      await expect(service.findAllByAccountId(99)).rejects.toThrow('Account not found');
      expect(accountRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
    });

    it('should return an empty array if no players are found for the given account ID', async () => {
      const account = new Account();
      account.id = 1;

      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(account);
      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);

      const result = await service.findAllByAccountId(1);
      expect(result).toEqual([]);
      expect(playerRepository.find).toHaveBeenCalledWith({
        where: { account: { id: 1 } },
        select: ['id', 'name', 'vocation', 'level'],
      });
    });
  });

  describe('findByPlayerId', () => {
    it('should return a player when found by ID', async () => {
      const player = new Player();
      player.id = 1;
      player.name = 'TestPlayer';

      jest.spyOn(playerRepository, 'findOne').mockImplementation(async (options) => {
        const where = options.where as { id: number };
        return where.id === player.id ? player : undefined;
      });

      const result = await service.findByPlayerId(1);
      expect(result).toEqual(player);
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return undefined when player is not found by ID', async () => {
      jest.spyOn(playerRepository, 'findOne').mockImplementation(async (options) => {
        const where = options.where as { id: number };
        return where.id === 999 ? undefined : new Player();
      });

      const result = await service.findByPlayerId(999);
      expect(result).toBeUndefined();
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('updateTransferableCoins', () => {
    it('should update transferable coins and return the updated player', async () => {
      const player = new Player();
      player.name = 'TestPlayer';
      player.account = new Account();
      player.account.coinsTransferable = 100;
      player.account.coins = 200;

      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(player.account);

      const result = await service.updateTransferableCoins('TestPlayer', 50);
      expect(result).toEqual(new PlayerResponseDto(player));
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'TestPlayer' },
        relations: ['account'],
      });
      expect(accountRepository.save).toHaveBeenCalledWith(player.account);
      expect(player.account.coinsTransferable).toBe(150);
      expect(player.account.coins).toBe(250);
    });

    it('should throw NotFoundException if player is not found', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateTransferableCoins('UnknownPlayer', 50)).rejects.toThrow(NotFoundException);
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'UnknownPlayer' },
        relations: ['account'],
      });
    });
  });
});
