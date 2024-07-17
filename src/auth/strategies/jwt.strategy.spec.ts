import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [JwtStrategy, Logger],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate payload and return account data', async () => {
    const payload = { sub: 1, email: 'test@example.com' };
    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({ accountId: payload.sub, id: payload.sub, email: payload.email });
  });
});
