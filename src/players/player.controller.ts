import { Controller, Param, Patch, Body, Get, Post, NotFoundException, Req, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.entity';
import { AuthGuard } from '@nestjs/passport';

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
  async getPlayerByName(@Param('name') name: string): Promise<Player> {
    const player = await this.playerService.findByPlayerName(name);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(ValidationPipe)
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
          vocation: 1,
          sex: 0,
          town_id: 1,
        },
      },
    },
  })
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto, @Req() request): Promise<Player> {
    const accountId = request.user.sub; 
    return this.playerService.createPlayer(createPlayerDto, accountId);
  }
}
