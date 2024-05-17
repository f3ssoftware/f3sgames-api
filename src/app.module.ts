import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './players/player.entity';
import { PlayerController } from './players/player.controller';
import { PlayerService } from './players/player.service';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), AuthModule],
  controllers: [AppController, PlayerController],
  providers: [AppService, PlayerService],
})
export class AppModule {}
