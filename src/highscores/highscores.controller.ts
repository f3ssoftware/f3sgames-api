import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HighscoresService } from './highscores.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Vocation } from 'src/players/enums/vocations.enum';
import { Category } from './enum/category.enum';
import { VocationFilter } from './dto/vocationFilter.dto';

@ApiTags('highscores')
@Controller('highscores')
export class HighscoresController {
  constructor(private readonly highscoresService: HighscoresService) {}

  @Get()
  @ApiOperation({ summary: 'Get highscores' })
  @ApiQuery({ name: 'category', required: true, enum: Category })
  @ApiQuery({ name: 'vocation', required: true, enum: VocationFilter })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Highscores retrieved successfully.',
  })
  async getHighscores(
    @Query('category') category: Category,
    @Query('vocation') vocation: VocationFilter = VocationFilter.All,
    @Query('limit') limit: number = 10,
  ): Promise<
    {
      rank: number;
      name: string;
      vocation: string;
      level: number;
      skillLevel?: number;
      points?: number;
    }[]
  > {
    if (limit < 10) {
      limit = 10;
    } else if (limit > 1000) {
      limit = 1000;
    }

    const vocationNumber = this.mapVocationFilterToNumber(vocation);
    return this.highscoresService.getHighscores(
      category,
      vocationNumber,
      limit,
    );
  }

  private mapVocationFilterToNumber(vocation: VocationFilter): number | 'All' {
    switch (vocation) {
      case VocationFilter.All:
        return 'All';
      case VocationFilter.None:
        return Vocation.None;
      case VocationFilter.Sorcerer:
        return Vocation.Sorcerer;
      case VocationFilter.Druid:
        return Vocation.Druid;
      case VocationFilter.Paladin:
        return Vocation.Paladin;
      case VocationFilter.Knight:
        return Vocation.Knight;
      default:
        return 'All';
    }
  }
}