import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,
  ) {}

  async findByPlayerName(name: string): Promise<Player | undefined> {
    console.log(`Searching for player with name: ${name}`);
    const player = await this.playerRepository.findOne({
      where: { name },
      relations: ['account'],
    });
    console.log(`Player found: ${JSON.stringify(player, null, 2)}`);
    if (player) {
      player.account = null;
    }
    return player;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    console.log('Creating player:', createPlayerDto);
    const existingPlayer = await this.findByPlayerName(createPlayerDto.name);
    if (existingPlayer) {
      throw new ConflictException('Player with this name already exists');
    }
    const newPlayer = this.playerRepository.create(createPlayerDto);
    console.log('New player instance:', newPlayer);
    return this.playerRepository.save(newPlayer);
  }

  async findByPlayerId(id: number): Promise<Player | undefined> {
    console.log(`Searching for player with ID: ${id}`);
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    console.log('Player found by ID:', player);
    if (player) {
      player.account = null;
    }
    return player;
  }

  async updateTransferableCoins(name: string, coins: number): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { name },
      relations: ['account'],
    });
    if (!player) throw new NotFoundException('Player not found');

    player.account.coinsTransferable += coins;
    return this.playerRepository.save(player);
  }
}
