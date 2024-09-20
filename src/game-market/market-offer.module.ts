import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketOffer } from './market-offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketOffer], 'gameConnection'),
  ],
  exports: [TypeOrmModule],
})
export class MarketOfferModule {}
