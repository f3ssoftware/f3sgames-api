import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsTickerService } from './news-ticker.service';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';

@Controller('news-ticker')
export class NewsTickerController {
  constructor(private readonly newsTickerService: NewsTickerService) {}

  @Post()
  create(@Body() createNewsTickerDto: CreateNewsTickerDto) {
    return this.newsTickerService.create(createNewsTickerDto);
  }

  @Get()
  findAll() {
    return this.newsTickerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsTickerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsTickerDto: UpdateNewsTickerDto) {
    return this.newsTickerService.update(+id, updateNewsTickerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsTickerService.remove(+id);
  }
}
