import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { Account } from '../account/account.entity';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';

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
          },
        },
        {
          provide: getRepositoryToken(Account, 'gameConnection'),
          useValue: {
            findOne: jest.fn(),
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

});
