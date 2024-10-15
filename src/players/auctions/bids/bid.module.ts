import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { Bid } from './bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid], 'websiteConnection')],
  providers: [BidService],
  exports: [BidService], 
})
export class BidModule {}
