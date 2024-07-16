import { Module } from '@nestjs/common';
import { NewsTickerService } from './news-ticker.service';
import { NewsTickerController } from './news-ticker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTicker } from './entities/news-ticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsTicker], 'paymentConnection')],
  controllers: [NewsTickerController],
  providers: [NewsTickerService],
})
export class NewsTickerModule {}
