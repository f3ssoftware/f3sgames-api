import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';

const mockAccountRepository = () => ({
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
});

describe('AccountService', () => {
  let service: AccountService;
  let repository: ReturnType<typeof mockAccountRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account, 'gameConnection'),
          useFactory: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get(getRepositoryToken(Account, 'gameConnection'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {
      const accounts = [{ id: 1, name: 'John', email: 'john@example.com' }];
      repository.find.mockResolvedValue(accounts);

      expect(await service.findAll()).toEqual(accounts);
      expect(repository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'email'],
      });
    });
  });

  describe('findOneOrFail', () => {
    it('should return an account if found', async () => {
      const account = { id: 1, name: 'John', email: 'john@example.com' };
      repository.findOneOrFail.mockResolvedValue(account);

      expect(await service.findOneOrFail({ where: { id: 1 } })).toEqual(account);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if not found', async () => {
      repository.findOneOrFail.mockRejectedValue(new Error('Account not found'));

      await expect(service.findOneOrFail({ where: { id: 1 } })).rejects.toThrow(NotFoundException);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('store', () => {
    it('should create and return a new account', async () => {
      const createAccountDto: CreateAccountDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'StrongPass1',
      };
      const account = { id: 1, ...createAccountDto, premDays: 0, premDaysPurchased: 0, coins: 0 };
      repository.create.mockReturnValue(account);
      repository.save.mockResolvedValue(account);

      expect(await service.store(createAccountDto)).toEqual(account);
      expect(repository.create).toHaveBeenCalledWith(createAccountDto);
      expect(repository.save).toHaveBeenCalledWith(account);
    });
  });

  describe('update', () => {
    it('should update and return the account', async () => {
      const updateAccountDto: UpdateAccountDto = {
        name: 'John Updated',
        email: 'john_updated@example.com',
      };
      const account = { id: 1, name: 'John', email: 'john@example.com', premDays: 0, premDaysPurchased: 0, coins: 0 };
      repository.findOneOrFail.mockResolvedValue(account);
      repository.save.mockResolvedValue({ ...account, ...updateAccountDto });

      expect(await service.update(1, updateAccountDto)).toEqual({ ...account, ...updateAccountDto });
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(account, updateAccountDto);
      expect(repository.save).toHaveBeenCalledWith({ ...account, ...updateAccountDto });
    });

    it('should throw a NotFoundException if account not found', async () => {
      const updateAccountDto: UpdateAccountDto = {
        name: 'John Updated',
        email: 'john_updated@example.com',
      };
      repository.findOneOrFail.mockRejectedValue(new Error('Account not found'));

      await expect(service.update(1, updateAccountDto)).rejects.toThrow(NotFoundException);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('destroy', () => {
    it('should delete the account', async () => {
      repository.findOneOrFail.mockResolvedValue({ id: 1 });

      await service.destroy(1);

      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if account not found', async () => {
      repository.findOneOrFail.mockRejectedValue(new Error('Account not found'));

      await expect(service.destroy(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
