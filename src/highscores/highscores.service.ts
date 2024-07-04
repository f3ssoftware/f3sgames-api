import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../players/player.entity';
import { Vocation } from '../players/enums/vocations.enum';

@Injectable()
export class HighscoresService {
  constructor(
    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,
  ) {}

  private getVocations(vocation: number | 'All'): number[] {
    if (vocation === 'All') {
      return Object.values(Vocation).filter(value => typeof value === 'number') as number[];
    }

    switch (vocation) {
      case Vocation.Sorcerer:
      case Vocation.MasterSorcerer:
        return [Vocation.Sorcerer, Vocation.MasterSorcerer];
      case Vocation.Druid:
      case Vocation.ElderDruid:
        return [Vocation.Druid, Vocation.ElderDruid];
      case Vocation.Paladin:
      case Vocation.RoyalPaladin:
        return [Vocation.Paladin, Vocation.RoyalPaladin];
      case Vocation.Knight:
      case Vocation.EliteKnight:
        return [Vocation.Knight, Vocation.EliteKnight];
      default:
        return [vocation];
    }
  }

  async getHighscores(category: string, vocation: number | 'All', limit: number): Promise<Player[]> {
    let orderField: keyof Player;

    switch (category) {
      case 'level':
        orderField = 'level';
        break;
      case 'experience':
        orderField = 'experience';
        break;
      case 'maglevel':
        orderField = 'maglevel';
        break;
      case 'skill_fist':
        orderField = 'skill_fist';
        break;
      case 'skill_club':
        orderField = 'skill_club';
        break;
      case 'skill_sword':
        orderField = 'skill_sword';
        break;
      case 'skill_axe':
        orderField = 'skill_axe';
        break;
      case 'skill_dist':
        orderField = 'skill_dist';
        break;
      case 'skill_shielding':
        orderField = 'skill_shielding';
        break;
      case 'skill_fishing':
        orderField = 'skill_fishing';
        break;
      case 'boss_points':
        orderField = 'boss_points';
        break;
      default:
        throw new Error('Invalid category');
    }

    const vocations = this.getVocations(vocation);
    const queryBuilder = this.playerRepository.createQueryBuilder('player');

    if (vocation !== 'All') {
      queryBuilder.where('player.vocation IN (:...vocations)', { vocations });
    }

    return queryBuilder
      .orderBy(`player.${orderField}`, 'DESC')
      .limit(limit)
      .getMany();
  }
}
