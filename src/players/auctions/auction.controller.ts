import { Controller, Post, Param, Body, Get, Patch, ParseIntPipe } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { Auction } from './auction.entity';
import { IsNumberString, IsDateString } from 'class-validator';

class CreateAuctionDto {
  @IsNumberString()
  startingPrice: number;

  @IsDateString()
  endTime: Date;
}

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post(':playerId')
  async createAuction(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() createAuctionDto: CreateAuctionDto,
  ): Promise<Auction> {
    const { startingPrice, endTime } = createAuctionDto;
    return this.auctionService.createAuction(playerId, startingPrice, endTime);
  }

  @Patch(':auctionId/finish')
  async finishAuction(@Param('auctionId', ParseIntPipe) auctionId: number): Promise<void> {
    return this.auctionService.finishAuction(auctionId);
  }

  @Get()
  async getAllAuctions(): Promise<Auction[]> {
    return this.auctionService.getAllAuctions();
  }
}
