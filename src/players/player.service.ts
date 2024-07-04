import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Account } from '../account/account.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,
    @InjectRepository(Account, 'gameConnection')
    private accountRepository: Repository<Account>,
  ) {}

  async findByPlayerName(name: string): Promise<Player | undefined> {
    console.log(`Searching for player with name: ${name}`);
    const player = await this.playerRepository.findOne({
      where: { name },
      relations: ['account'],
    });

    if (player) {
      player.account = null;
    }
    return player;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto, accountId: number): Promise<Player> {
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

    return this.playerRepository.save(newPlayer);
  }

  async findByPlayerId(id: number): Promise<Player | undefined> {
    console.log(`Searching for player with ID: ${id}`);
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['account'],
    });

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
    player.account.coins += coins;
    await this.accountRepository.save(player.account);
    return player;
  }
}
