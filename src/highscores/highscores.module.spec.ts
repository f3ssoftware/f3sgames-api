import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighscoresService } from './highscores.service';
import { HighscoresController } from './highscores.controller';
import { Player } from '../players/player.entity';
import { HighscoresModule } from './highscores.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('HighscoresModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Player], 'gameConnection'),
        HighscoresModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Player, 'gameConnection'))
      .useClass(Repository)
      .compile();
  });

  it('should be defined', () => {
    const highscoresModule = testingModule.get<HighscoresModule>(HighscoresModule);
    expect(highscoresModule).toBeDefined();
  });

  it('should have HighscoresService', () => {
    const service = testingModule.get<HighscoresService>(HighscoresService);
    expect(service).toBeDefined();
  });

  it('should have HighscoresController', () => {
    const controller = testingModule.get<HighscoresController>(HighscoresController);
    expect(controller).toBeDefined();
  });
});
