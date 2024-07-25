import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsPost } from './news-post.entity';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsPost, 'paymentConnection')
    private newsRepository: Repository<NewsPost>
  ) {}

  async createNews(createNewsDto: CreateNewsDto): Promise<NewsPost> {
    const news = this.newsRepository.create(createNewsDto);
    return await this.newsRepository.save(news);
  }

}
