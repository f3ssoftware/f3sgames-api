import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NewsTickerService } from './news-ticker.service';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('news-ticker')
export class NewsTickerController {
  constructor(private readonly newsTickerService: NewsTickerService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create new news ticker' })
  @ApiResponse({ status: 200, description: 'News Ticker created.' })
  @ApiResponse({ status: 404, description: 'Problem to create.' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() newsTickerData: CreateNewsTickerDto, @Req() req: Request) {
    const accountId = req.user['accountId']; 
    return await this.newsTickerService.create(newsTickerData, accountId);
  }

  @ApiOperation({ summary: 'Find all news ticker' })
  @ApiResponse({ status: 200, description: 'News Ticker found.' })
  @ApiResponse({ status: 404, description: 'News ticker not found.' })
  @Get()
  async findAll() {
    return await this.newsTickerService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find one news ticker' })
  @ApiResponse({ status: 200, description: 'This News Ticker found.' })
  @ApiResponse({ status: 404, description: 'This News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.newsTickerService.findOne({ where: { id } });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update one news ticker' })
  @ApiResponse({ status: 200, description: 'This News Ticker updated.' })
  @ApiResponse({ status: 404, description: 'This News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateNewsTickerData: UpdateNewsTickerDto) {
    return await this.newsTickerService.update(id, updateNewsTickerData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete one news ticker' })
  @ApiResponse({ status: 200, description: 'This News Ticker removed.' })
  @ApiResponse({ status: 404, description: 'This News ticker not found.' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.newsTickerService.remove(id);
  }
}
