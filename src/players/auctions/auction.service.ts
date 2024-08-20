import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';
import { MarketOffer } from 'src/game-market/market-offer.entity';
import { HousesService } from 'src/houses/house.service';
import { Status } from 'src/houses/enums/status.enum';
import { Order } from 'src/houses/enums/order.enum';
import { GuildMembership } from 'src/guilds/guild-membership/guild-membership.entity';
import { GuildInvite } from 'src/guilds/guild-invite/guild-invite.entity';
import { PlayerNamelock } from '../namelocks/player-namelock.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction, 'websiteConnection')
    private auctionRepository: Repository<Auction>,
    
    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,
    
    @InjectRepository(Account, 'gameConnection')
    private accountRepository: Repository<Account>,
    
    @InjectRepository(MarketOffer, 'gameConnection')
    private marketOfferRepository: Repository<MarketOffer>,
    
    @InjectRepository(GuildMembership, 'gameConnection')
    private guildMembershipRepository: Repository<GuildMembership>,
    
    @InjectRepository(GuildInvite, 'gameConnection')
    private guildInviteRepository: Repository<GuildInvite>,
    
    @InjectRepository(PlayerNamelock, 'gameConnection')
    private playerNamelockRepository: Repository<PlayerNamelock>,
    
    private housesService: HousesService,
  ) {}

  async createAuction(playerId: number, startingPrice: number, endTime: Date): Promise<Auction> {
    const player = await this.playerRepository.findOne({ where: { id: playerId }, relations: ['account'] });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    if (player.skull !== 0) {
      throw new BadRequestException('Player with a skull cannot be auctioned');
    }

    const houses = await this.housesService.getHouses({ town: 'All Towns', status: Status.ALL_STATES, order: Order.BY_NAME });
    const playerHouse = houses.find(house => house.owner === player.id);

    const namelock = await this.playerNamelockRepository.findOne({ where: { playerId } });
    if (namelock) {
      throw new BadRequestException('Player has a namelock and cannot be auctioned');
    }

    if (playerHouse) {
      throw new BadRequestException('Player with a house cannot be auctioned');
    }

    const existingAuction = await this.auctionRepository.findOne({
      where: { playerId: player.id, status: 'ongoing' },
    });

    if (existingAuction) {
      throw new BadRequestException('This player is already in an active auction');
    }

    const activeOffer = await this.marketOfferRepository.findOne({ where: { player_id: player.id } });

    if (activeOffer) {
      throw new BadRequestException('Player has an active market offer and cannot be auctioned');
    }

    const guildMembership = await this.guildMembershipRepository.findOne({ where: { player: { id: playerId } } });
    if (guildMembership) {
      throw new BadRequestException('Player is a member of a guild and cannot be auctioned');
    }

    const guildInvite = await this.guildInviteRepository.findOne({ where: { player: { id: playerId } } });
    if (guildInvite) {
      throw new BadRequestException('Player has pending guild invites and cannot be auctioned');
    }

    const auction = this.auctionRepository.create({
      playerId: player.id,
      startingPrice,
      startTime: new Date(),
      endTime,
      status: 'ongoing',
    });

    return this.auctionRepository.save(auction);
  }

  async finishAuction(auctionId: number): Promise<void> {
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['bids'] });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const player = await this.playerRepository.findOne({ where: { id: auction.playerId } });
    if (!player) {
      throw new NotFoundException('Player not found for this auction');
    }

    const highestBid = auction.bids.reduce((prev, current) => (prev.amount > current.amount ? prev : current), auction.bids[0]);

    if (highestBid) {
      const bidder = await this.accountRepository.findOne({ where: { id: highestBid.bidderId } });
      if (!bidder) {
        throw new NotFoundException('Bidder account not found');
      }

      auction.winnerAccountId = bidder.id;
      auction.finalPrice = highestBid.amount;
      auction.status = 'finished';
      auction.companyFee = auction.finalPrice * 0.1;

      await this.auctionRepository.save(auction);

      await this.updateCoins(bidder.id, auction.finalPrice - auction.companyFee);
      await this.updateCoins(1, auction.companyFee); // 1 representa a conta da sua empresa
    } else {
      throw new BadRequestException('No bids placed for this auction');
    }
  }

  async updateCoins(accountId: number, coins: number): Promise<void> {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    account.coinsTransferable += coins;
    account.coins += coins;
    await this.accountRepository.save(account);
  }

  async getAllAuctions(): Promise<Auction[]> {
    const auctions = await this.auctionRepository.find();

    for (const auction of auctions) {
      auction['player'] = await this.playerRepository.findOne({ where: { id: auction.playerId } });
      auction['winnerAccount'] = await this.accountRepository.findOne({ where: { id: auction.winnerAccountId } });
    }

    return auctions;
  }
}
