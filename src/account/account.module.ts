import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { PlayerModule } from '../players/player.module'; // Importe o PlayerModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Account], 'gameConnection'), 
    PlayerModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService, TypeOrmModule], 
})
export class AccountModule {}
