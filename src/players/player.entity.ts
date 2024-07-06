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

  @Column({ default: 1 })
  group_id: number;

  @Column()
  account_id: number;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  vocation: number;

  @Column({ default: 150 })
  health: number;

  @Column({ default: 150 })
  healthmax: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: '' })
  conditions: string;

  @Column({ default: 1 })
  town_id: number;

  @ManyToOne(() => Account, (account) => account.players)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToOne(() => PlayersOnline, (playersOnline) => playersOnline.player)
  playersOnline: PlayersOnline;
}
