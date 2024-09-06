import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Auction } from '../auction.entity';
import { Player } from '../../player.entity';
import { Account } from '../../../account/account.entity';
import { MarketOffer } from 'src/game-market/market-offer.entity';
import { HousesService } from 'src/houses/house.service';
import { GuildMembership } from 'src/guilds/guild-membership/guild-membership.entity';
import { GuildInvite } from 'src/guilds/guild-invite/guild-invite.entity';
import { PlayerNamelock } from '../../namelocks/player-namelock.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { AuctionValidationService } from './auction-validation.service';
import { CharacterTransferService } from './character-transfer.service';
import { BidService } from '../bids/bid.service';
import { Bid } from '../bids/bid.entity';
import { AuctionTimeService } from './auction-time.service';
@Injectable()
export class AuctionService {

  private readonly logger = new Logger(AuctionService.name);

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
    private auctionValidationService: AuctionValidationService,
    private characterTransferService: CharacterTransferService,
    private bidService: BidService,
    private auctionTimeService: AuctionTimeService,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.checkAuctionsStatus();
    await this.deleteOldAuctions();
    await this.bidService.cleanUpBids();
  }

  async checkAuctionsStatus(): Promise<void> {
    const now = new Date();
    this.logger.debug(`Current time (UTC): ${now.toISOString()}`);

    const ongoingAuctions = await this.auctionRepository.find({
      where: { status: 'ongoing' },
      relations: ['bids'],
    });

    for (const auction of ongoingAuctions) {
      this.logger.debug(`Auction ID: ${auction.id}, End Time (UTC): ${auction.endTime.toISOString()}`);

      if (auction.endTime <= now) {
        this.logger.debug(`Auction ID: ${auction.id} is being checked for completion.`);

        if (auction.bids && auction.bids.length > 0) {
          const highestBid = auction.bids.reduce((prev, current) => (prev.amount > current.amount ? prev : current), auction.bids[0]);
          const bidder = await this.accountRepository.findOne({ where: { id: highestBid.bidderId } });

          auction.winnerAccountId = bidder.id;
          await this.auctionRepository.save(auction);

          if (bidder.coins < highestBid.amount) {
            this.logger.warn(`Auction ID: ${auction.id} has a winning bidder without enough coins. Marking as 'pendent'.`);
            auction.status = 'pendent';
            await this.auctionRepository.save(auction);
            this.scheduleCheckForCoins(auction); // Certifique-se de agendar para auctions pendentes imediatamente.
          } else {
            auction.status = 'completed';
            this.logger.debug(`Auction ID: ${auction.id} status set to 'completed'. Initiating character transfer.`);
            await this.transferCharacterToWinner(auction);
          }
        } else {
          auction.status = 'canceled';
        }

        await this.auctionRepository.save(auction);
        this.logger.debug(`Auction ID: ${auction.id} status updated to ${auction.status}.`);
      }
    }

    // Verifique se há leilões pendentes fora do loop de leilões em andamento
    const pendingAuctions = await this.auctionRepository.find({
      where: { status: 'pendent' },
    });

    for (const auction of pendingAuctions) {
      this.logger.debug(`Auction ID: ${auction.id} is in 'pendent' status, scheduling coin check.`);
      this.scheduleCheckForCoins(auction);
    }
}

  async createAuction(accountId: number, playerId: number, startingPrice: number, endTimeUTC: Date, startTimeUTC: Date): Promise<Auction> {
    const auction = this.auctionRepository.create({
      playerId,
      startingPrice,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      status: 'ongoing',
    });

    this.logger.debug(`Auction criado com sucesso: ${JSON.stringify(auction)}`);
    return this.auctionRepository.save(auction);
  }

  async finishAuction(accountId: number, auctionId: number): Promise<void> {
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['bids'] });

    await this.auctionValidationService.validateAuctionFinish(auction, accountId);

    auction.status = 'canceled';
    await this.auctionRepository.save(auction);
    this.logger.debug(`Auction ID: ${auction.id} has been canceled.`);
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

  async deleteOldAuctions(): Promise<void> {
    const oneMonthAgoDate = moment.utc().subtract(1, 'month').toDate();

    const oldAuctions = await this.auctionRepository.find({
      where: {
        status: In(['completed', 'canceled']),
        endTime: LessThan(oneMonthAgoDate),
      },
      relations: ['bids'],
    });

    for (const auction of oldAuctions) {
      // Delete bids associated with this auction using BidService
      await this.bidService.deleteBidsByAuctionId(auction.id);
    }

    const deleteResult = await this.auctionRepository.delete({
      status: In(['completed', 'canceled']),
      endTime: LessThan(oneMonthAgoDate),
    });

    this.logger.debug(`Old auctions deleted: ${deleteResult.affected} entries.`);

    // Reorder bid IDs using BidService after deleting old auctions and their bids
    await this.bidService.reorderBidIds();
  }

  async placeBid(accountId: number, auctionId: number, amount: number): Promise<{ bid: Bid; highestBid: number }> {
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['bids'] });

    await this.auctionValidationService.validatePlaceBid(auction, accountId, amount);

    const highestBid = auction.bids.length > 0 ? auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max) : null;

    if (highestBid && highestBid.amount < amount) {
      highestBid.amount = amount;
      highestBid.bidderId = accountId;
      const savedBid = await this.bidService.saveBid(highestBid);
      return { bid: savedBid, highestBid: savedBid.amount };
    } else if (!highestBid) {
      const savedBid = await this.bidService.createBid(auction, amount, accountId);
      return { bid: savedBid, highestBid: savedBid.amount };
    } else {
      throw new BadRequestException('Bid must be higher than the current highest bid');
    }
  }

  async transferCharacterToWinner(auction: Auction): Promise<boolean> {
    try {
        await this.characterTransferService.transferCharacterToWinner(auction);
        return true;
    } catch (error) {
        this.logger.error(`Erro ao transferir o personagem para o leilão ID ${auction.id}: ${error.message}`, error.stack);
        return false;
    }
}

scheduleCheckForCoins(auction: Auction): void {
  const checkInterval = 3600000; // 1h in miliseconds

  this.logger.debug(`Scheduling check for coins for auction ID: ${auction.id} with interval of ${checkInterval} ms`);

  setTimeout(async () => {
      const currentTime = new Date();
      const timeElapsed = currentTime.getTime() - auction.endTime.getTime();
      const hoursElapsed = timeElapsed / 3600000; // Converting milliseconds to hours

      this.logger.debug(`Auction ID: ${auction.id}: Hours elapsed since end time: ${hoursElapsed}`);

      if (hoursElapsed >= 24) {
          if (auction.status === 'pendent') {
              this.logger.warn(`Auction ID: ${auction.id} is being canceled after 24 hours of inactivity.`);
              auction.status = 'canceled';
              await this.auctionRepository.save(auction);
              this.logger.debug(`Auction ID: ${auction.id} status updated to canceled after 24 hours.`);
          }
      } else {
          // Recheck again after 10 seconds if the time has not yet exceeded 24 hours
          const updatedAuction = await this.auctionRepository.findOne({ where: { id: auction.id }, relations: ['bids'] });
          if (updatedAuction && updatedAuction.status === 'pendent') {
              this.logger.debug(`Re-checking coins for auction ID: ${auction.id}`);
              const transferSuccess = await this.transferCharacterToWinner(updatedAuction);
              if (transferSuccess) {
                  updatedAuction.status = 'completed';
                  await this.auctionRepository.save(updatedAuction);
                  this.logger.debug(`Auction ID: ${auction.id} successfully transferred character and marked as completed.`);
              } else {
                  this.logger.debug(`Auction ID: ${auction.id} failed to transfer character, retrying.`);
              }
          }
          this.scheduleCheckForCoins(updatedAuction);
      }
  }, checkInterval);
}

  async finishTransaction(auctionId: number, accountId: number): Promise<void> {
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['bids'] });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.winnerAccountId !== accountId) {
      throw new ForbiddenException('You do not have permission to finalize this transaction.');
    }

    if (auction.status === 'pendent') {
      try {
        await this.transferCharacterToWinner(auction);
      } catch (error) {
        this.logger.error(`Error finalizing transaction: ${error.message}`, error.stack);
        throw new InternalServerErrorException('An error occurred while finalizing the transaction.');
      }
    } else {
      throw new BadRequestException('Auction is not in a pendent state.');
    }
  }
}
