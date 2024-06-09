import { Controller, Param, Patch, Body, Get, Post, NotFoundException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';

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

  @Get(':name')
  @ApiOperation({ summary: 'Get player by name' })
  @ApiResponse({ status: 200, description: 'Player found.' })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  @ApiParam({ name: 'name', required: true, description: 'Player name' })
  async getPlayerByName(@Param('name') name: string) {
    const player = await this.playerService.findByPlayerName(name);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  @Post()
@ApiOperation({ summary: 'Create a new player' })
@ApiResponse({ status: 201, description: 'Player created successfully.' })
@ApiResponse({ status: 404, description: 'Error creating player.' })
@ApiBody({
  type: CreatePlayerDto,
  examples: {
    example1: {
      summary: 'Example request',
      value: {
        name: 'New Player',
        group_id: 1,
        account_id: 1,
        level: 1,
        vocation: 1,
        health: 150,
        healthmax: 150,
        experience: 0,
        town_id: 1,
        conditions: ''
      }
    }
  }
})
async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
  return this.playerService.createPlayer(createPlayerDto);
}

}
