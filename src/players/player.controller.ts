  import { Controller, Param, Patch, Body } from '@nestjs/common';
  import { PlayerService } from './player.service';

  @Controller('players')
  export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Patch(':name/transferable-coins')
    async updateTransferableCoins(@Param('name') name: string, @Body('coins') coins: number) {
      return this.playerService.updateTransferableCoins(name, coins);
    }
  }