import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsTickerService } from './news-ticker.service';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('news-ticker')
export class NewsTickerController {
  constructor(private readonly newsTickerService: NewsTickerService) {}

  @Post()
  @ApiOperation({ summary: 'Create new news ticker' })
  @ApiResponse({ status: 200, description: 'News Ticker created.' })
  @ApiResponse({ status: 404, description: 'Problem to create.' })
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() newsTickerData: CreateNewsTickerDto) {
    return await this.newsTickerService.create(newsTickerData);
  }

  @Get()
  @ApiOperation({ summary: 'Find all news ticker' })
  @ApiResponse({ status: 200, description: 'News Ticker found.' })
  @ApiResponse({ status: 404, description: 'News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return await this.newsTickerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one news ticker' })
  @ApiResponse({ status: 200, description: 'This News Ticker found.' })
  @ApiResponse({ status: 404, description: 'This News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: number) {
    return await this.newsTickerService.findOne({where: {id}});
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one news ticker' })
  @ApiResponse({ status: 200, description: 'This News Ticker updated.' })
  @ApiResponse({ status: 404, description: 'This News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: number, @Body() updateNewsTickerData: UpdateNewsTickerDto) {
    return await this.newsTickerService.update(id, updateNewsTickerData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one news ticker' })
  @ApiResponse({ status: 200, description: 'This News Ticker removed.' })
  @ApiResponse({ status: 404, description: 'This News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number) {
    return await this.newsTickerService.remove(id);
  }
}
