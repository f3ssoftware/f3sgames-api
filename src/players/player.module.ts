import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { Account } from '../account/account.entity'; // Adicione se necessário
import { PlayerController } from './player.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Account], 'gameConnection')],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
