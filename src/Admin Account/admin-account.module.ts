import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAccount } from './admin-account.entity';
import { Player } from 'src/players/player.entity';
import { Account } from 'src/account/account.entity';
import { AdminAccountService } from './admin-account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminAccount], 'websiteConnection'), 
    TypeOrmModule.forFeature([Player, Account], 'gameConnection'),
  ],
  providers: [AdminAccountService],
  exports: [AdminAccountService, TypeOrmModule],
})
export class AdminAccountModule {}
