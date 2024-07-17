import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let accountService: AccountService;
  let jwtService: JwtService;
  let accountRepository: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
        {
          provide: AccountService,
          useValue: {
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    accountService = module.get<AccountService>(AccountService);
    jwtService = module.get<JwtService>(JwtService);
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  describe('login', () => {
    it('should return a token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const token = 'mocked_token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);

      expect(result).toEqual({ token });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email });
    });
  });

  describe('validateAccount', () => {
    it('should return the account if validation is successful', async () => {
      const email = 'test@example.com';
      const password = 'StrongPass1';
      const hashedPassword = bcrypt.hashSync(password, 10);
      const account = { id: 1, email, password: hashedPassword } as Account;

      jest.spyOn(accountService, 'findOneOrFail').mockResolvedValue(account);

      const result = await service.validateAccount(email, password);

      expect(result).toEqual(account);
    });

    it('should return null if the account is not found', async () => {
      const email = 'test@example.com';
      const password = 'StrongPass1';

      jest.spyOn(accountService, 'findOneOrFail').mockRejectedValue(new Error('Account not found'));

      const result = await service.validateAccount(email, password);

      expect(result).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'StrongPass1';
      const wrongPassword = 'WrongPass';
      const hashedPassword = bcrypt.hashSync(wrongPassword, 10);
      const account = { id: 1, email, password: hashedPassword } as Account;

      jest.spyOn(accountService, 'findOneOrFail').mockResolvedValue(account);

      const result = await service.validateAccount(email, password);

      expect(result).toBeNull();
    });
  });
});
