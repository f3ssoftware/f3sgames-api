/* istanbul ignore file */
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';

export class PlayerResponseDto {
  id: number;
  name: string;
  vocation: number;
  sex: number;
  town_id: number;
  level: number;
  experience: number;
  maglevel: number;
  skill_fist: number;
  skill_club: number;
  skill_sword: number;
  skill_axe: number;
  skill_dist: number;
  skill_shielding: number;
  skill_fishing: number;
  boss_points: number;
  account: {
    id: number;
    name: string;
    premDays: number;
    premDaysPurchased: number;
    coins: number;
    coinsTransferable: number;
    tournamentCoins: number;
    creation: number;
    recruiter: number;
  };

  constructor(player: Player) {
    this.id = player.id;
    this.name = player.name;
    this.vocation = player.vocation;
    this.sex = player.sex;
    this.town_id = player.town_id;
    this.level = player.level;
    this.experience = player.experience;
    this.maglevel = player.maglevel;
    this.skill_fist = player.skill_fist;
    this.skill_club = player.skill_club;
    this.skill_sword = player.skill_sword;
    this.skill_axe = player.skill_axe;
    this.skill_dist = player.skill_dist;
    this.skill_shielding = player.skill_shielding;
    this.skill_fishing = player.skill_fishing;
    this.boss_points = player.boss_points;
    this.account = {
      id: player.account.id,
      name: player.account.name,
      premDays: player.account.premDays,
      premDaysPurchased: player.account.premDaysPurchased,
      coins: player.account.coins,
      coinsTransferable: player.account.coinsTransferable,
      tournamentCoins: player.account.tournamentCoins,
      creation: player.account.creation,
      recruiter: player.account.recruiter,
    };
  }
}
