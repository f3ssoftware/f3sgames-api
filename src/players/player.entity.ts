import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { PlayersOnline } from 'src/players-online/entities/players-online.entity';

@Entity({ name: 'players' })
@Unique(['name'])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @ManyToOne(() => Account, (account) => account.players)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToOne(() => PlayersOnline, (playersOnline) => playersOnline.player)
  playersOnline: PlayersOnline;
}
