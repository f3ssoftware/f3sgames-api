import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../player.entity';
import { Auction } from '../auction.entity';
import { Account } from '../../../account/account.entity';
import { MarketOffer } from 'src/game-market/market-offer.entity';
import { GuildMembership } from 'src/guilds/guild-membership/guild-membership.entity';
import { GuildInvite } from 'src/guilds/guild-invite/guild-invite.entity';
import { PlayerNamelock } from '../../namelocks/player-namelock.entity';
import { HousesService } from 'src/houses/house.service';
import { Status } from 'src/houses/enums/status.enum';
import { Order } from 'src/houses/enums/order.enum';

@Injectable()
export class AuctionValidationService {
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

  async validateAuctionCreation(accountId: number, playerId: number, startingPrice: number, endTime: Date, startTime: Date): Promise<void> {
    const player = await this.findPlayer(playerId);

    this.validateOwnership(player, accountId);
    this.validateAuctionTime(startTime, endTime);

    if (player.skull !== 0) {
      throw new BadRequestException('Player with a skull cannot be auctioned');
    }

    const playerHouse = await this.findPlayerHouse(player.id);
    if (playerHouse) {
      throw new BadRequestException('Player with a house cannot be auctioned');
    }

    await this.checkExistingEntities(playerId, player.id);
  }

  private async findPlayer(playerId: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id: playerId }, relations: ['account'] });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  private validateOwnership(player: Player, accountId: number): void {
    if (player.account.id !== accountId) {
      throw new ForbiddenException('You do not have permission to auction this player');
    }
  }

  private validateAuctionTime(startTime: Date, endTime: Date): void {
    const timeDifferenceInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (timeDifferenceInHours < 24) {
      throw new BadRequestException('End time must be at least 24 hours after the start time');
    }
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after the start time');
    }
  }

  private async findPlayerHouse(playerId: number): Promise<any> {
    return (await this.housesService.getHouses({ town: 'All Towns', status: Status.ALL_STATES, order: Order.BY_NAME }))
      .find(house => house.owner === playerId);
  }

  private async checkExistingEntities(playerId: number, internalPlayerId: number): Promise<void> {
    const namelock = await this.playerNamelockRepository.findOne({ where: { playerId } });
    if (namelock) {
      throw new BadRequestException('Player has a namelock and cannot be auctioned');
    }

    const existingAuction = await this.auctionRepository.findOne({
      where: { playerId: internalPlayerId, status: 'ongoing' },
    });
    if (existingAuction) {
      throw new BadRequestException('This player is already in an active auction');
    }

    const activeOffer = await this.marketOfferRepository.findOne({ where: { player_id: internalPlayerId } });
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
  }

  // Validation to finish an Auction
  async validateAuctionFinish(auction: Auction, accountId: number): Promise<void> {
    const player = await this.playerRepository.findOne({ where: { id: auction.playerId }, relations: ['account'] });

    if (!player) {
      throw new NotFoundException('Player not found for this auction');
    }

    if (player.account.id !== accountId) {
      throw new ForbiddenException('You do not have permission to cancel this auction');
    }

    if (auction.bids && auction.bids.length > 0) {
      const now = new Date();
      if (auction.endTime > now) {
        throw new ForbiddenException('Auction cannot be canceled before the end time because there are bids');
      }
    }
  }

  // Validation to bid
  async validatePlaceBid(auction: Auction, accountId: number, amount: number): Promise<void> {
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
  
    const player = await this.playerRepository.findOne({ where: { id: auction.playerId }, relations: ['account'] });
  
    if (!player) {
      throw new NotFoundException('Player not found');
    }
  
    const playerAccount = player.account;
  
    if (playerAccount.id === accountId) {
      throw new ForbiddenException('You cannot bid on your own auction');
    }
  
    if (amount < auction.startingPrice) {
      throw new BadRequestException('Bid must be equal or greater than the starting price');
    }
  
    const highestBid = auction.bids.reduce((max, bid) => (bid.amount > max ? bid.amount : max), 0);
    if (amount <= highestBid) {
      throw new BadRequestException('Bid must be higher than the current highest bid');
    }
  }
  
}
