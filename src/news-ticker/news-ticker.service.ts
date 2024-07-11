import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsTicker } from './entities/news-ticker.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class NewsTickerService {
  constructor(
    @InjectRepository(NewsTicker, 'paymentConnection')
    private newsTickerRepository: Repository<NewsTicker>) {}


  async create(newsTickerData: CreateNewsTickerDto) {
    const newsTicker = await this.newsTickerRepository.create(newsTickerData);   
    return await this.newsTickerRepository.save(newsTicker);
  }

  async findAll() {
    return await this.newsTickerRepository.find({
      select:['id', 'createdAt', 'title', 'author', 'description']
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

  async remove(id: number) {
    await this.newsTickerRepository.findOne({where: {id}});
    this.newsTickerRepository.softDelete(id);
  }
}
