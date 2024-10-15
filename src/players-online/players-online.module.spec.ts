import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersOnline } from './entities/players-online.entity';
import { PlayersOnlineService } from './players-online.service';
import { PlayersOnlineController } from './players-online.controller';
import { PlayersOnlineModule } from './players-online.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PlayersOnlineModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([PlayersOnline], 'gameConnection'),
        PlayersOnlineModule,
      ],
    })
      .overrideProvider(getRepositoryToken(PlayersOnline, 'gameConnection'))
      .useClass(Repository)
      .compile();
  });

  it('should be defined', () => {
    const playersOnlineModule = testingModule.get<PlayersOnlineModule>(PlayersOnlineModule);
    expect(playersOnlineModule).toBeDefined();
  });

  it('should have PlayersOnlineService', () => {
    const service = testingModule.get<PlayersOnlineService>(PlayersOnlineService);
    expect(service).toBeDefined();
  });

  it('should have PlayersOnlineController', () => {
    const controller = testingModule.get<PlayersOnlineController>(PlayersOnlineController);
    expect(controller).toBeDefined();
  });
});
