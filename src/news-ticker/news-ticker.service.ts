import { Injectable } from '@nestjs/common';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';

@Injectable()
export class NewsTickerService {
  create(createNewsTickerDto: CreateNewsTickerDto) {
    return 'This action adds a new newsTicker';
  }

  findAll() {
    return `This action returns all newsTicker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newsTicker`;
  }

  update(id: number, updateNewsTickerDto: UpdateNewsTickerDto) {
    return `This action updates a #${id} newsTicker`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsTicker`;
  }
}
