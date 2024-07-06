import { Test, TestingModule } from '@nestjs/testing';
import { PlayersOnlineService } from './players-online.service';

describe('PlayersOnlineService', () => {
  let service: PlayersOnlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayersOnlineService],
    }).compile();

    service = module.get<PlayersOnlineService>(PlayersOnlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
