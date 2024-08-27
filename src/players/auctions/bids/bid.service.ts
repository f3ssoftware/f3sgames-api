import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { Auction } from '../auction.entity';

@Injectable()
export class BidService {
  private readonly logger = new Logger(BidService.name);

  constructor(
    @InjectRepository(Bid, 'websiteConnection')
    private bidRepository: Repository<Bid>,
  ) {}

  async cleanUpBids(): Promise<void> {
    // Find bids with auctions that are non-existent or have ended (completed/canceled)
    const orphanBids = await this.bidRepository.createQueryBuilder('bid')
      .leftJoin('bid.auction', 'auction')
      .where('auction.id IS NULL OR auction.status IN (:...statuses)', { statuses: ['completed', 'canceled'] })
      .getMany();

    if (orphanBids.length > 0) {
      await this.bidRepository.remove(orphanBids);
      this.logger.debug(`Orphan bids deleted: ${orphanBids.length} entries.`);
    } else {
      this.logger.debug('No orphan bids to delete.');
    }
  }

  async reorderBidIds(): Promise<void> {
    const bids = await this.bidRepository.find({ order: { id: 'ASC' } });
    for (let i = 0; i < bids.length; i++) {
      const bid = bids[i];
      bid.id = i + 1; // Start IDs from 1
      await this.bidRepository.save(bid);
    }
    this.logger.debug('Bid IDs have been reordered.');
  }

  async saveBid(bid: Bid): Promise<Bid> {
    const savedBid = await this.bidRepository.save(bid);
    this.logger.debug(`Bid with ID ${savedBid.id} has been saved.`);
    return savedBid;
  }

  async deleteBidsByAuctionId(auctionId: number): Promise<void> {
    await this.bidRepository.delete({ auction: { id: auctionId } });
    this.logger.debug(`Bids for auction ID: ${auctionId} have been deleted.`);
  }

  async createBid(auction: Auction, amount: number, bidderId: number): Promise<Bid> {
    const newBid = this.bidRepository.create({
      auction,
      amount,
      bidderId,
    });
    const savedBid = await this.saveBid(newBid);
    return savedBid;
  }
}
