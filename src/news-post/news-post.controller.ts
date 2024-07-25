import { Controller, Post, Body } from '@nestjs/common';
import { NewsService } from './news-post.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NewsPost } from './news-post.entity';

@ApiTags('news-post')
@Controller('news-post')
export class NewsPostController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new news post' })
  @ApiResponse({ status: 201, description: 'News post created successfully.', type: NewsPost })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateNewsDto })
  async createNews(@Body() createNewsDto: CreateNewsDto): Promise<NewsPost> {
    return await this.newsService.createNews(createNewsDto);
  }
}
