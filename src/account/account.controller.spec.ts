import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';
import { AuthGuard } from '@nestjs/passport';

const mockAccountService = {
  store: jest.fn(),
  findAll: jest.fn(),
  findOneOrFail: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        { provide: AccountService, useValue: mockAccountService },
      ],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('store', () => {
    it('should create and return a new account', async () => {
      const createAccountDto: CreateAccountDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'StrongPass1',
        premDays: 0,
        premDaysPurchased: 0,
        coins: 0,
        coinsTransferable: 0,
        tournamentCoins: 0,
        creation: 0,
        recruiter: 0,
        id: 0,
      };
      const account = { id: 1, ...createAccountDto };
      mockAccountService.store.mockResolvedValue(account);

      expect(await controller.store(createAccountDto)).toEqual(account);
      expect(mockAccountService.store).toHaveBeenCalledWith(createAccountDto);
    });
  });

  describe('index', () => {
    it('should return an array of accounts', async () => {
      const accounts = [{ id: 1, name: 'John', email: 'john@example.com' }];
      mockAccountService.findAll.mockResolvedValue(accounts);

      expect(await controller.index()).toEqual(accounts);
      expect(mockAccountService.findAll).toHaveBeenCalled();
    });
  });

  describe('indexOf', () => {
    it('should return a single account by ID', async () => {
      const account = { id: 1, name: 'John', email: 'john@example.com' };
      mockAccountService.findOneOrFail.mockResolvedValue(account);

      expect(await controller.indexOf(1)).toEqual(account);
      expect(mockAccountService.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update and return the account', async () => {
      const updateAccountDto: UpdateAccountDto = {
        name: 'John Updated',
        email: 'john_updated@example.com',
        password: 'UpdatedPass1',
        premDays: 0,
        premDaysPurchased: 0,
        coins: 0,
        coinsTransferable: 0,
        tournamentCoins: 0,
        creation: 0,
        recruiter: 0,
      };
      const account = { id: 1, name: 'John', email: 'john@example.com', premDays: 0, premDaysPurchased: 0, coins: 0, coinsTransferable: 0, tournamentCoins: 0, creation: 0, recruiter: 0 };
      mockAccountService.update.mockResolvedValue({ ...account, ...updateAccountDto });

      expect(await controller.update(1, updateAccountDto)).toEqual({ ...account, ...updateAccountDto });
      expect(mockAccountService.update).toHaveBeenCalledWith(1, updateAccountDto);
    });
  });

  describe('destroy', () => {
    it('should delete the account', async () => {
      mockAccountService.destroy.mockResolvedValue(undefined);

      await controller.destroy(1);

      expect(mockAccountService.destroy).toHaveBeenCalledWith(1);
    });
  });
});
