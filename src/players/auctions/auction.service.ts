import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createAuction(playerId: number, startingPrice: number, endTime: Date): Promise<Auction> {
    const player = await this.playerRepository.findOne({ where: { id: playerId }, relations: ['account'] });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    if (player.skull !== 0) {
      throw new BadRequestException('Player with a skull cannot be auctioned');
    }

    const account = player.account;
    const existingAuction = await this.auctionRepository.findOne({
      where: { player, status: 'ongoing' },
    });

    if (existingAuction) {
      throw new BadRequestException('This player is already in an active auction');
    }

    const auction = this.auctionRepository.create({
      player,
      startingPrice,
      startTime: new Date(),
      endTime,
      status: 'ongoing',
    });

    return this.auctionRepository.save(auction);
  }

  async finishAuction(auctionId: number): Promise<void> {
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId }, relations: ['player', 'winnerAccount'] });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    auction.status = 'finished';
    auction.finalPrice = auction.finalPrice || auction.startingPrice;
    auction.companyFee = auction.finalPrice * 0.1;

    await this.auctionRepository.save(auction);

    await this.updateCoins(auction.winnerAccount.id, auction.finalPrice - auction.companyFee);
    await this.updateCoins(1, auction.companyFee); // 1 represents our company
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
}
