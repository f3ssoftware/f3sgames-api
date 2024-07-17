import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/account.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          name: 'gameConnection',
          imports: [ConfigModule],
          useFactory: async () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [Account],
            synchronize: true,
          }),
          inject: [ConfigModule],
        }),
        TypeOrmModule.forFeature([Account], 'gameConnection'),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '60s' },
        }),
        AccountModule,
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtService,
        {
          provide: getRepositoryToken(Account, 'gameConnection'),
          useClass: Repository,
        },
        {
          provide: 'gameConnectionDataSource',
          useValue: new DataSource({ type: 'sqlite', database: ':memory:' }),
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have AuthService', () => {
    expect(authService).toBeDefined();
  });

  it('should login a user', async () => {
    const req = {
      user: {
        email: 'test@example.com',
        password: '428181Abc#',
      },
    } as unknown as Request;

    const result = {
      token: 'some-jwt-token',
    };

    jest.spyOn(authService, 'login').mockImplementation(async () => result);

    expect(await controller.login(req)).toBe(result);
    expect(authService.login).toHaveBeenCalledWith(req.user);
  });
});