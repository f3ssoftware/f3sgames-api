import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTickerService } from './news-ticker.service';
import { NewsTickerController } from './news-ticker.controller';
import { NewsTicker } from './entities/news-ticker.entity';
import { AdminAccountModule } from '../Admin Account/admin-account.module';
import { Account } from '../account/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsTicker], 'websiteConnection'),
  TypeOrmModule.forFeature([Account], 'gameConnection'),
    AdminAccountModule],
  controllers: [NewsTickerController],
  providers: [NewsTickerService],
})
export class NewsTickerModule {}
