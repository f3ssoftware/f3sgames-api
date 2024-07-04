import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighscoresService } from './highscores.service';
import { HighscoresController } from './highscores.controller';
import { Player } from '../players/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player], 'gameConnection')],
  providers: [HighscoresService],
  controllers: [HighscoresController],
})
export class HighscoresModule {}

