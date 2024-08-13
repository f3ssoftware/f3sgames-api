import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { Auction } from './auction.entity';
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Player, Account], 'websiteConnection'),
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
