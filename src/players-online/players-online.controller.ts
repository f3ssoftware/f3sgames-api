import { Controller, Get } from '@nestjs/common';
import { PlayersOnlineService } from './players-online.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('players-online')
export class PlayersOnlineController {
  constructor(private readonly playersOnlineService: PlayersOnlineService) {}


  @ApiOperation({ summary: 'List players online' })
  @ApiResponse({ status: 200, description: 'Players online found.' })
  @ApiResponse({ status: 404, description: 'no players online.' })
  @Get()
  async findAll() {
    return await this.playersOnlineService.findAllPlayersOnline();
  }

}
