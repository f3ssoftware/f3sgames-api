import { Controller, Post, Param, Body, Get, Patch, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuctionService } from './services/auction.service';
import { CreateAuctionDto } from '../dto/create-auction.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment-timezone';
import { CreateBidDto } from './bids/dto/create-bid.dto';

@Controller('auctions')
@ApiBearerAuth('access-token')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new auction' })
  @ApiResponse({ status: 201, description: 'Auction created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You do not have permission to auction this player.' })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  @Post(':playerId')
  async createAuction(
    @Req() req,
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() createAuctionDto: CreateAuctionDto,
  ) {
    const accountId = req.user.id;  // Assuming JWT provides the account ID here

    const startingPrice = createAuctionDto.startingPrice;
    const startTime = moment.utc().toDate(); 
    const endDate = moment.utc(createAuctionDto.endDate, 'DD/MM/YYYY HH:mm').toDate(); 

    return this.auctionService.createAuction(accountId, playerId, startingPrice, endDate, startTime);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Finish an auction' })
  @ApiResponse({ status: 200, description: 'Auction finished successfully.' })
  @ApiResponse({ status: 404, description: 'Auction or player not found.' })
  @Patch(':auctionId/finish')
  async finishAuction(
    @Req() req,
    @Param('auctionId', ParseIntPipe) auctionId: number,
  ) {
    const accountId = req.user.id;  // Assuming JWT provides the account ID here
    return this.auctionService.finishAuction(accountId, auctionId);
  }

  @ApiOperation({ summary: 'Get all auctions' })
  @ApiResponse({ status: 200, description: 'List of all auctions.' })
  @Get()
  async getAllAuctions() {
    return this.auctionService.getAllAuctions();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Bid on an auction' })
  @ApiResponse({ status: 201, description: 'Bid placed successfully.' })
  @ApiResponse({ status: 403, description: 'You cannot bid on your own auction.' })
  @ApiResponse({ status: 400, description: 'Bid must be equal or greater than the starting price.' })
  @ApiResponse({ status: 404, description: 'Auction not found.' })
  @ApiBody({ type: CreateBidDto })
  @Post(':auctionId/bid')
  async bidOnAuction(
    @Req() req,
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Body('amount') amount: number,
  ) {
    const accountId = req.user.id;  // Assuming JWT provides the account ID here
    const { bid, highestBid } = await this.auctionService.placeBid(accountId, auctionId, amount);
    
    return {
      bid,
      highestBid,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Finish auction transaction' })
  @ApiResponse({ status: 200, description: 'Transaction finished successfully.' })
  @ApiResponse({ status: 404, description: 'Auction or player not found.' })
  @Post(':auctionId/finish-transaction')
  async finishTransaction(
      @Req() req,
      @Param('auctionId', ParseIntPipe) auctionId: number
  ) {
      const accountId = req.user.id;  // Assuming JWT provides the account ID here
      return this.auctionService.finishTransaction(auctionId, accountId);
  }
}
