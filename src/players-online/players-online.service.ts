import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersOnline } from './entities/players-online.entity';


@Injectable()
export class PlayersOnlineService {
  constructor(
    @InjectRepository(PlayersOnline, 'gameConnection')
    private readonly playersOnlineRepository: Repository<PlayersOnline>,

  ) {}

  async findAllPlayersOnline(): Promise<PlayersOnline[] | undefined> {
    return await this.playersOnlineRepository.find({
      relations: ['player'],
      select: ['player']
    });
  }


}
