import { Module } from '@nestjs/common';
import { PlayersOnlineService } from './players-online.service';
import { PlayersOnlineController } from './players-online.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersOnline } from './entities/players-online.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayersOnline], 'gameConnection')],
  controllers: [PlayersOnlineController],
  providers: [PlayersOnlineService],
  exports: [TypeOrmModule, PlayersOnlineService],
})
export class PlayersOnlineModule {}
