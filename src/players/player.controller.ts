import { Controller, Param, Patch, Body, Get, Post, NotFoundException, Req, UsePipes, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.entity';
import { AuthGuard } from '@nestjs/passport';
import { PlayerResponseDto } from './dto/player-response.dto';

@ApiTags('players')
@ApiBearerAuth('access-token')
@Controller('players')
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);

  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(AuthGuard('jwt'))
@Patch(':name/transferable-coins')
@ApiOperation({ summary: 'Update transferable coins for a player' })
@ApiResponse({ status: 200, description: 'Transferable coins updated successfully.' })
@ApiResponse({ status: 404, description: 'Player not found.' })
@ApiParam({ name: 'name', required: true, description: 'Player name' })
@ApiBody({ schema: { type: 'object', properties: { coins: { type: 'number' } } } })
async updateTransferableCoins(@Param('name') name: string, @Body('coins') coins: number): Promise<PlayerResponseDto> { 
  this.logger.debug(`Entering updateTransferableCoins with player: ${name} and coins: ${coins}`);
  const result = await this.playerService.updateTransferableCoins(name, coins);
  this.logger.debug(`Exiting updateTransferableCoins with result: ${JSON.stringify(result)}`);
  return result;
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
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto, @Req() request): Promise<PlayerResponseDto> {
    const accountId = request.user?.accountId;
    this.logger.debug(`Creating player for account id: ${accountId}`);
    return this.playerService.createPlayer(createPlayerDto, accountId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'List all players for the logged-in account' })
  @ApiResponse({ status: 200, description: 'Players listed successfully.' })
  async listPlayers(@Req() request): Promise<Partial<Player>[]> {
    const accountId = request.user?.accountId;
    this.logger.debug(`Account ID from request: ${accountId}`);
    if (!accountId) {
      this.logger.error('Account ID is undefined');
      throw new NotFoundException('Account ID not found');
    }
    const players = await this.playerService.findAllByAccountId(accountId);
    this.logger.debug(`Players found: ${JSON.stringify(players)}`);
    return players;
  }
}
