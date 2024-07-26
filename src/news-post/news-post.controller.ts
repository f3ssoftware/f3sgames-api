import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { NewsService } from './news-post.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
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

  @Get()
  @ApiOperation({ summary: 'Get all news posts' })
  @ApiResponse({ status: 200, description: 'List of news posts', type: [NewsPost] })
  async findAllNews(): Promise<NewsPost[]> {
    return await this.newsService.findAllNews();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news post by ID' })
  @ApiResponse({ status: 204, description: 'News post deleted successfully.' })
  @ApiResponse({ status: 404, description: 'News post not found.' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the news post to delete' })
  async deleteNewsById(@Param('id') id: string): Promise<void> {
    return await this.newsService.deleteNewsById(id);
  }
}
