import { Test, TestingModule } from '@nestjs/testing';
import { PlayerModule } from './player.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { AccountModule } from '../account/account.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';

describe('PlayerModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          name: 'gameConnection',
          useFactory: async () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [Player],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([Player], 'gameConnection'),
        AccountModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have PlayerService', () => {
    const service = module.get<PlayerService>(PlayerService);
    expect(service).toBeDefined();
  });

  it('should have PlayerController', () => {
    const controller = module.get<PlayerController>(PlayerController);
    expect(controller).toBeDefined();
  });
});
