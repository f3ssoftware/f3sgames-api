import { Controller, Param, Patch, Body } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Patch(':name/transferable-coins')
  @ApiOperation({ summary: 'Update transferable coins for a player' })
  @ApiResponse({ status: 200, description: 'Transferable coins updated successfully.' })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  @ApiParam({ name: 'name', required: true, description: 'Player name' })
  @ApiBody({ schema: { type: 'object', properties: { coins: { type: 'number' } } } })
  async updateTransferableCoins(@Param('name') name: string, @Body('coins') coins: number) {
    return this.playerService.updateTransferableCoins(name, coins);
  }
}
