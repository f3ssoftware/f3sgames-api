import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { HighscoresService } from './highscores.service';
import { Player } from '../players/player.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Vocation } from '../players/enums/vocations.enum';

@ApiTags('highscores')
@Controller('highscores')
export class HighscoresController {
  constructor(private readonly highscoresService: HighscoresService) {}

  @Get()
  @ApiOperation({ summary: 'Get highscores' })
  @ApiQuery({ name: 'category', required: true, type: String })
  @ApiQuery({ name: 'vocation', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Highscores retrieved successfully.' })
  async getHighscores(
    @Query('category') category: string,
    @Query('vocation') vocation: string = 'All',
    @Query('limit') limit: number = 10,
  ): Promise<Player[]> {
    if (limit < 10) {
      limit = 10;
    } else if (limit > 1000) {
      limit = 1000;
    }

    const vocationNumber = vocation === 'All' ? 'All' : Vocation[vocation as keyof typeof Vocation];
    return this.highscoresService.getHighscores(category, vocationNumber, limit);
  }
}
