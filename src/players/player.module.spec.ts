import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { AccountModule } from '../account/account.module';
import { PlayerModule } from './player.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PlayerModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Player], 'gameConnection'),
        AccountModule,
        PlayerModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Player, 'gameConnection'))
      .useClass(Repository)
      .compile();
  });

  it('should be defined', () => {
    const playerModule = testingModule.get<PlayerModule>(PlayerModule);
    expect(playerModule).toBeDefined();
  });

  it('should have PlayerService', () => {
    const service = testingModule.get<PlayerService>(PlayerService);
    expect(service).toBeDefined();
  });

  it('should have PlayerController', () => {
    const controller = testingModule.get<PlayerController>(PlayerController);
    expect(controller).toBeDefined();
  });
});