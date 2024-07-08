import { Controller, Get } from '@nestjs/common';
import { PlayersOnlineService } from './players-online.service';

@Controller('players-online')
export class PlayersOnlineController {
  constructor(private readonly playersOnlineService: PlayersOnlineService) {}


  @Get()
  async findAll() {
    return await this.playersOnlineService.findAllPlayersOnline();
  }

}
