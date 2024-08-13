import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from '../players/auctions/auction.service';
import { Auction } from '../players/auctions/auction.entity';
import { Player } from '../players/player.entity';
import { Account } from '../account/account.entity';
import { MarketOffer } from './market-offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Player, Account, MarketOffer], 'gameConnection'),
  ],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
