import { Test, TestingModule } from '@nestjs/testing';
import { PlayersOnlineController } from './players-online.controller';
import { PlayersOnlineService } from './players-online.service';

describe('PlayersOnlineController', () => {
  let controller: PlayersOnlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersOnlineController],
      providers: [PlayersOnlineService],
    }).compile();

    controller = module.get<PlayersOnlineController>(PlayersOnlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
