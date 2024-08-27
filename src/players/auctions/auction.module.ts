import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from './services/auction.service';
import { AuctionController } from './auction.controller';
import { Auction } from './auction.entity';
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';
import { HousesModule } from 'src/houses/house.module';
import { GuildMembership } from 'src/guilds/guild-membership/guild-membership.entity';
import { GuildInvite } from 'src/guilds/guild-invite/guild-invite.entity';
import { MarketOfferModule } from 'src/game-market/market-offer.module';
import { PlayerNamelockModule } from 'src/players/namelocks/player-namelock.module';
import { BidModule } from './bids/bid.module'; 
import { AuctionValidationService } from './services/auction-validation.service';
import { CharacterTransferService } from './services/character-transfer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction], 'websiteConnection'), 
    TypeOrmModule.forFeature([Player, Account, GuildMembership, GuildInvite], 'gameConnection'), 
    HousesModule, 
    MarketOfferModule, 
    PlayerNamelockModule, 
    BidModule,
  ],
  providers: [
    AuctionService,
    AuctionValidationService, 
    CharacterTransferService, 
  ],
  controllers: [AuctionController],
  exports: [AuctionService],
})
export class AuctionModule {}
