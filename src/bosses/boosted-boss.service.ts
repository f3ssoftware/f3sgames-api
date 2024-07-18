import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoostedBoss } from './boosted-boss.entity';

@Injectable()
export class BoostedBossService {
  constructor(
    @InjectRepository(BoostedBoss, 'gameConnection')
    private boostedBossRepository: Repository<BoostedBoss>,
  ) {}

  async findAll(): Promise<BoostedBoss[]> {
    return this.boostedBossRepository.find();
  }
}
