import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { Account } from '../account/account.entity';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forFeature([Account], 'gameConnection'),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '60s' },
        }),
        AuthModule,
        AccountModule,
      ],
      providers: [LocalStrategy, JwtStrategy],
    }).compile();
  });

  it('should be defined', () => {
    const app = module.get<AuthModule>(AuthModule);
    expect(app).toBeDefined();
  });
});
