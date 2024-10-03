import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTickerService } from './news-ticker.service';
import { NewsTickerController } from './news-ticker.controller';
import { NewsTicker } from './entities/news-ticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsTicker], 'websiteConnection')],
  controllers: [NewsTickerController],
  providers: [NewsTickerService],
})
export class NewsTickerModule {}
