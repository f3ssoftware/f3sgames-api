import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
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
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { Bid } from './bids/bid.entity';

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

    @InjectRepository(Bid, 'websiteConnection')
    private bidRepository: Repository<Bid>,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.checkAuctionsStatus();
    await this.deleteOldAuctions();
  }

  async createAuction(accountId: number, playerId: number, startingPrice: number, endTime: Date, startTime: Date): Promise<Auction> {
    const player = await this.playerRepository.findOne({ where: { id: playerId }, relations: ['account'] });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    if (player.account.id !== accountId) {
      throw new ForbiddenException('You do not have permission to auction this player');
    }

    const startTimeMs = startTime.getTime();
    const endTimeMs = endTime.getTime();

    console.log(`Start time (Local): ${startTime.toISOString()}`);
    console.log(`End time (Local): ${endTime.toISOString()}`);
    console.log(`Difference in milliseconds: ${endTimeMs - startTimeMs}`);

    const timeDifferenceInHours = (endTimeMs - startTimeMs) / (1000 * 60 * 60);

    if (timeDifferenceInHours < 24) {
      throw new BadRequestException('End time must be at least 24 hours after the start time');
    }

    if (endTimeMs <= startTimeMs) {
      throw new BadRequestException('End time must be after the start time');
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
      startTime,
      endTime,
      status: 'ongoing',
    });

    return this.auctionRepository.save(auction);
  }

    async finishAuction(accountId: number, auctionId: number): Promise<void> {
      const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['bids'] });

      if (!auction) {
        throw new NotFoundException('Auction not found');
      }

      const player = await this.playerRepository.findOne({ where: { id: auction.playerId }, relations: ['account'] });
      if (!player) {
        throw new NotFoundException('Player not found for this auction');
      }

      if (player.account.id !== accountId) {
        throw new ForbiddenException('You do not have permission to finish this auction');
      }

      // Check if there are bids on the specific auction
      const hasBids = auction.bids && auction.bids.length > 0;

      if (hasBids) {
        const now = new Date();
        if (auction.endTime > now) {
          throw new ForbiddenException('Auction cannot be finished before the end time because there are bids');
        }
      }
      auction.status = 'finished';

      if (hasBids) {
        const highestBid = auction.bids.reduce((prev, current) => (prev.amount > current.amount ? prev : current), auction.bids[0]);

        if (highestBid) {
          const bidder = await this.accountRepository.findOne({ where: { id: highestBid.bidderId } });
          if (!bidder) {
            throw new NotFoundException('Bidder account not found');
          }

          auction.winnerAccountId = bidder.id;
          auction.finalPrice = highestBid.amount;
          auction.companyFee = auction.finalPrice * 0.1;

          await this.updateCoins(bidder.id, auction.finalPrice - auction.companyFee);
          await this.updateCoins(1, auction.companyFee); // 1 represents your company account
        }
      }

      await this.auctionRepository.save(auction);
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

  async getAllAuctions(): Promise<any[]> {
    const auctions = await this.auctionRepository.find({ relations: ['bids'] });

    return auctions.map(auction => {
      const highestBid = auction.bids.length > 0 ? auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max).amount : null;
      return {
        id: auction.id,
        playerId: auction.playerId,
        startingPrice: auction.startingPrice,
        finalPrice: auction.finalPrice,
        startTime: auction.startTime,
        endTime: auction.endTime,
        createdAt: auction.createdAt,
        status: auction.status,
        winnerAccountId: auction.winnerAccountId,
        companyFee: auction.companyFee,
        highestBid: highestBid,
      };
    });
  }

  async checkAuctionsStatus(): Promise<void> {
    const now = moment.tz('America/Sao_Paulo').toDate();
    console.log(`Current time (Local): ${now.toISOString()}`);

    const ongoingAuctions = await this.auctionRepository.find({
      where: { status: 'ongoing' },
    });

    for (const auction of ongoingAuctions) {
      console.log(`Auction ID: ${auction.id}, End Time (Local): ${auction.endTime.toISOString()}`);

      if (auction.endTime <= now) {
        console.log(`Auction ID: ${auction.id} is being finished.`);
        auction.status = 'finished';
        await this.auctionRepository.save(auction);
        console.log(`Auction ID: ${auction.id} status updated to finished.`);
      }
    }
  }

  async deleteOldAuctions(): Promise<void> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const deleteResult = await this.auctionRepository.delete({
      status: 'finished',
      endTime: LessThan(oneMonthAgo),
    });

    console.log(`Old auctions deleted: ${deleteResult.affected} entries.`);
  }

  async placeBid(accountId: number, auctionId: number, amount: number): Promise<{ bid: Bid; highestBid: number }> {
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['bids'] });
  
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
  
    // This step is needed because the player repository is on a different DB connection
    const player = await this.playerRepository.findOne({ where: { id: auction.playerId }, relations: ['account'] });
  
    if (!player) {
      throw new NotFoundException('Player not found');
    }
  
    const playerAccount = player.account;
  
    // Ensure the bidder is not the same as the auctioned player’s account
    if (playerAccount.id === accountId) {
      throw new ForbiddenException('You cannot bid on your own auction');
    }
  
    // Ensure bid is equal to or higher than starting price
    if (amount < auction.startingPrice) {
      throw new BadRequestException('Bid must be equal or greater than the starting price');
    }
  
    // Ensure bid is higher than the current highest bid
    const highestBid = auction.bids.reduce((max, bid) => (bid.amount > max ? bid.amount : max), 0);
    if (amount <= highestBid) {
      throw new BadRequestException('Bid must be higher than the current highest bid');
    }
  
    // Create and save the new bid
    const bid = this.bidRepository.create({
      auction: auction,
      amount: amount,
      bidderId: accountId,
    });
  
    const savedBid = await this.bidRepository.save(bid);
  
    // Calculate the new highest bid after saving
    const newHighestBid = auction.bids.concat(savedBid).reduce((max, bid) => (bid.amount > max ? bid.amount : max), 0);
  
    return { bid: savedBid, highestBid: newHighestBid };
  }
  

}
