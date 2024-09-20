import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsPost } from './news-post.entity';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsPost, 'websiteConnection')
    private newsRepository: Repository<NewsPost>
  ) {}

  async createNews(createNewsDto: CreateNewsDto): Promise<NewsPost> {
    const news = this.newsRepository.create(createNewsDto);
    return await this.newsRepository.save(news);
  }

  async findAllNews(): Promise<NewsPost[]> {
    return await this.newsRepository.find();
  }

  async deleteNewsById(id: string): Promise<void> {
    const result = await this.newsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`News post with ID "${id}" not found`);
    }
  }
}
