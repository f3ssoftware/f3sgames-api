import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Account } from '../account/account.entity';

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

  @ManyToOne(() => Account, (account) => account.players)
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
