import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Account } from '../../account/account.entity';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('should validate account and return user', async () => {
    const user: Partial<Account> = {
      id: 1,
      name: 'John Doe',
      password: 'hashedpassword',
      email: 'test@example.com',
      premDays: 0,
      premDaysPurchased: 0,
      coins: 0,
      coinsTransferable: 0,
      tournamentCoins: 0,
      creation: Date.now(),
      recruiter: 0,
      players: [],
    };

    jest.spyOn(authService, 'validateAccount').mockResolvedValue(user as Account);

    const result = await localStrategy.validate('test@example.com', 'password');
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if invalid credentials', async () => {
    jest.spyOn(authService, 'validateAccount').mockResolvedValue(null);

    await expect(localStrategy.validate('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
  });
});
