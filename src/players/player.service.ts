
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async findByPlayerName(name: string): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { name }, relations: ['account'] });
  }

  async updateTransferableCoins(name: string, coins: number): Promise<Player> {
    const player = await this.findByPlayerName(name);
    if (!player) throw new NotFoundException('Player not found');

    player.account.coinsTransferable += coins;
    return this.playerRepository.save(player);
  }
}
