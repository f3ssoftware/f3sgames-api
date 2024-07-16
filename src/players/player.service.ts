import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Account } from '../account/account.entity';
import { PlayerResponseDto } from './dto/player-response.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,
    @InjectRepository(Account, 'gameConnection')
    private accountRepository: Repository<Account>,
  ) {}

  async findByPlayerName(name: string): Promise<Player | undefined> {
    this.logger.debug(`Searching for player with name: ${name}`);

    const player = await this.playerRepository.findOne({
      where: { name },
    });

    if (player) {
      this.logger.debug(`Player found: ${player.name}`);
    } else {
      this.logger.debug('Player name not found');
    }
    return player;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto, accountId: number): Promise<PlayerResponseDto> {
    const existingPlayer = await this.findByPlayerName(createPlayerDto.name);
    if (existingPlayer) {
      throw new ConflictException('Player with this name already exists');
    }
  
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
  
    const newPlayer = this.playerRepository.create({
      ...createPlayerDto,
      account,
    });
  
    const savedPlayer = await this.playerRepository.save(newPlayer);
  
    this.logger.debug(`Player ${savedPlayer.name} created successfully`);
  
    return new PlayerResponseDto(savedPlayer);
  }
  

  async findAllByAccountId(accountId: number): Promise<Partial<Player>[]> {
    this.logger.debug(`Listing players for account id: ${accountId}`);
    
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const players = await this.playerRepository.find({ 
      where: { account: { id: accountId } },
      select: ['id', 'name', 'vocation', 'level'],
    });

    if (players.length === 0) {
      this.logger.debug(`No players found for account id: ${accountId}`);
    } else {
      this.logger.debug(`Players found: ${JSON.stringify(players)}`);
    }
    return players;
  }

  async findByPlayerId(id: number): Promise<Player | undefined> {
    this.logger.debug(`Searching for player with ID: ${id}`);
    
    const player = await this.playerRepository.findOne({
      where: { id },
    });

    if (player) {
      this.logger.debug(`Player found: ${player.name}`);
    } else {
      this.logger.debug('Player ID not found');
    }
    return player;
  }

  async updateTransferableCoins(name: string, coins: number): Promise<PlayerResponseDto> {
    this.logger.debug(`updateTransferableCoins called with name: ${name}, coins: ${coins}`);
    const player = await this.playerRepository.findOne({
      where: { name },
      relations: ['account'],
    });
    if (!player) {
      this.logger.error('Player not found');
      throw new NotFoundException('Player not found');
    }
  
    player.account.coinsTransferable += coins;
    player.account.coins += coins;
    await this.accountRepository.save(player.account);

    const result = new PlayerResponseDto(player);
    this.logger.debug(`updateTransferableCoins result: ${JSON.stringify(result)}`);
    return result;
}

}
