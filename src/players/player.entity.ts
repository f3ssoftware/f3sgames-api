/* istanbul ignore file */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { PlayersOnline } from '../players-online/entities/players-online.entity';
import { Auction } from './auctions/auction.entity';
import { MarketOffer } from 'src/game-market/market-offer.entity';

@Entity({ name: 'players' })
@Unique(['name'])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  group_id: number;

  @Column({ default: '' }) 
  conditions: string;

  @Column()
  vocation: number;

  @Column()
  sex: number;

  @Column()
  town_id: number;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: 0 })
  maglevel: number;

  @Column({ default: 10 })
  skill_fist: number;

  @Column({ default: 10 })
  skill_club: number;

  @Column({ default: 10 })
  skill_sword: number;

  @Column({ default: 10 })
  skill_axe: number;

  @Column({ default: 10 })
  skill_dist: number;

  @Column({ default: 10 })
  skill_shielding: number;

  @Column({ default: 10 })
  skill_fishing: number;

  @Column({ default: 0 })
  boss_points: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 0 })
  skull: number;

  @Column({ default: 0 })
  blessings: number;

  @Column({ default: 0 })
  prey_wildcard: number;

  @Column({ default: 0 })
  randomize_mount: number;

  @Column({ default: 100 })
  forge_dust_level: number;

  @Column({ default: 0 })
  task_points: number;
  @ManyToOne(() => Account, (account) => account.players)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToOne(() => PlayersOnline, (playersOnline) => playersOnline.player)
  playersOnline: PlayersOnline;

  @OneToOne(() => Auction, (auction) => auction.player)
  auction: Auction;

  @OneToMany(() => MarketOffer, (marketOffer) => marketOffer.player)
  marketOffers: MarketOffer[];
}
