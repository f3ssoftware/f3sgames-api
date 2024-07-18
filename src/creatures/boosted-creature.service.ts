import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoostedCreature } from './boosted-creature.entity';

@Injectable()
export class BoostedCreatureService {
  constructor(
    @InjectRepository(BoostedCreature, 'gameConnection')
    private boostedCreatureRepository: Repository<BoostedCreature>,
  ) {}

  async findAll(): Promise<BoostedCreature[]> {
    return await this.boostedCreatureRepository.find();
  }
}
