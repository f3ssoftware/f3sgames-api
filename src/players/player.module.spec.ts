import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './player.module';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './player.entity';
import { AccountModule } from '../account/account.module';

describe('PlayerModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Player], 'gameConnection'),
        PlayerModule,
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
