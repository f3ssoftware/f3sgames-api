import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { Auction } from './auction.entity';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post(':playerId')
  async createAuction(
    @Param('playerId') playerId: number,
    @Body('startingPrice') startingPrice: number,
    @Body('endTime') endTime: Date,
  ): Promise<Auction> {
    return this.auctionService.createAuction(playerId, startingPrice, endTime);
  }

  @Patch('finish/:auctionId')
  async finishAuction(@Param('auctionId') auctionId: number): Promise<void> {
    return this.auctionService.finishAuction(auctionId);
  }
}
