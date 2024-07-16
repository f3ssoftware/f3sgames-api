import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighscoresService } from './highscores.service';
import { HighscoresController } from './highscores.controller';
import { HighscoresModule } from './highscores.module';
import { Player } from '../players/player.entity';

describe('HighscoresModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Player], 'gameConnection'), HighscoresModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have HighscoresService', () => {
    const service = module.get<HighscoresService>(HighscoresService);
    expect(service).toBeDefined();
  });

  it('should have HighscoresController', () => {
    const controller = module.get<HighscoresController>(HighscoresController);
    expect(controller).toBeDefined();
  });
});
