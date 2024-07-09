import { Module } from '@nestjs/common';
import { NewsTickerService } from './news-ticker.service';
import { NewsTickerController } from './news-ticker.controller';

@Module({
  controllers: [NewsTickerController],
  providers: [NewsTickerService],
})
export class NewsTickerModule {}
