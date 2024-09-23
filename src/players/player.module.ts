import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Account } from '../account/account.entity'; // Import the Account entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, Account], 'gameConnection'),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService, TypeOrmModule],
})
export class PlayerModule {}
