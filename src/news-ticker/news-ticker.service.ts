import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsTicker } from './entities/news-ticker.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class NewsTickerService {
  constructor(
    @InjectRepository(NewsTicker, 'websiteConnection')
    private newsTickerRepository: Repository<NewsTicker>) {}


    async create(newsTickerData: CreateNewsTickerDto) {
      // Check if the are more than 5 news tickers with enabled with true
      const activeNewsTickers = await this.newsTickerRepository.find({
        where: { enabled: true },
        order: { createdAt: 'ASC' }
      });
  
      // If there are more than 5 news tickers activated, it takes the older ones and put enabled as false
      if (activeNewsTickers.length >= 5) {
        const oldestTicker = activeNewsTickers[0];
        oldestTicker.enabled = false;
        await this.newsTickerRepository.save(oldestTicker);
      }
  
      const newsTicker = this.newsTickerRepository.create({ ...newsTickerData, enabled: true });
      return await this.newsTickerRepository.save(newsTicker);
    }

  async findAll() {

    return await this.newsTickerRepository.find({
      where: { enabled: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(options: FindOneOptions<NewsTicker>) {
    try {
        return await this.newsTickerRepository.findOneOrFail(options);
    }catch(error){
      throw new NotFoundException(error.message);
    }
    
  }

 async  update(id: number, updateNewsTickerData: UpdateNewsTickerDto) {
  const newsTicker = await this.findOne({where: {id}}); 
  this.newsTickerRepository.merge(newsTicker, updateNewsTickerData);
    return await this.newsTickerRepository.save(newsTicker);
  }

  async remove(id: number): Promise<UpdateResult> {
    await this.newsTickerRepository.findOne({ where: { id } });
    return this.newsTickerRepository.softDelete(id);
  }
 
}
