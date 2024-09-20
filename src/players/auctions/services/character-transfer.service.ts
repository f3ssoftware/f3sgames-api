import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Account } from '../../../account/account.entity';
import { Player } from '../../player.entity';
import { Auction } from '../auction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CharacterTransferService {
  private readonly logger = new Logger(CharacterTransferService.name);

  constructor(
    @InjectRepository(Auction, 'websiteConnection')
    private auctionRepository: Repository<Auction>,

    @InjectRepository(Account, 'gameConnection')
    private accountRepository: Repository<Account>,

    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,
  ) {}

  // This is a public method accessible to other services.
  async transferCharacterToWinner(auction: Auction): Promise<void> {
    const highestBid = this.findHighestBid(auction); // Encapsulated method usage

    if (!highestBid) {
      throw new NotFoundException('No valid bids found for this auction.');
    }

    const bidder = await this.accountRepository.findOne({ where: { id: highestBid.bidderId } });
    const sellerAccount = await this.accountRepository.findOne({ where: { id: auction.winnerAccountId } });
    const player = await this.playerRepository.findOne({ where: { id: auction.playerId } });

    if (!bidder || !sellerAccount || !player) {
      throw new NotFoundException('Necessary entities not found for transfer.');
    }

    if (bidder.coins >= highestBid.amount) {
      try {
        await this.performTransfer(bidder, sellerAccount, player, auction, highestBid.amount); // Encapsulated method
      } catch (error) {
        this.logger.error(`Error transferring character or updating coins: ${error.message}`, error.stack);
        throw new InternalServerErrorException('An error occurred during the transfer.');
      }
    } else {
      this.logger.warn(`Bidder ID: ${bidder.id} does not have enough coins. They have 24 hours to deposit the coins.`);
    }
  }

  private findHighestBid(auction: Auction) {
    return auction.bids.reduce((prev, current) => (prev.amount > current.amount ? prev : current), auction.bids[0]);
  }

  private async performTransfer(bidder: Account, sellerAccount: Account, player: Player, auction: Auction, amount: number) {
    bidder.coins -= amount;
    sellerAccount.coins += amount;

    await this.accountRepository.save(bidder);
    await this.accountRepository.save(sellerAccount);

    player.account = bidder;
    await this.playerRepository.save(player);

    auction.status = 'completed';
    auction.winnerAccountId = bidder.id;
    auction.finalPrice = amount;
    auction.companyFee = amount * 0.1;

    await this.auctionRepository.save(auction);
    this.logger.debug(`Player ID: ${player.id} has been transferred to account ID: ${bidder.id}.`);
  }
}
