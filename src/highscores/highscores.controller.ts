import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { HighscoresService } from './highscores.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Vocation } from 'src/players/enums/vocations.enum';
import { Category } from './enum/category.enum';

@ApiTags('highscores')
@Controller('highscores')
export class HighscoresController {
  constructor(private readonly highscoresService: HighscoresService) {}

  @Get()
  @ApiOperation({ summary: 'Get highscores' })
  @ApiQuery({ name: 'category', required: true, enum: Category })
  @ApiQuery({ name: 'vocation', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Highscores retrieved successfully.' })
  async getHighscores(
    @Query('category') category: Category,
    @Query('vocation') vocation: string = 'All',
    @Query('limit') limit: number = 10,
  ): Promise<{ rank: number, name: string, vocation: string, level: number, skillLevel?: number }[]> {
    if (limit < 10) {
      limit = 10;
    } else if (limit > 1000) {
      limit = 1000;
    }

    const vocationNumber = vocation === 'All' ? 'All' : Vocation[vocation as keyof typeof Vocation];
    return this.highscoresService.getHighscores(category, vocationNumber, limit);
  }
}
