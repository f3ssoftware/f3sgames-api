import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';
import { Bid } from './bids/bid.entity';

@Entity({ name: 'auctions' })
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id' })
  playerId: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  startingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'ongoing' })
  status: 'ongoing' | 'finished' | 'canceled';

  @Column({ nullable: true })
  winnerAccountId: number;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  companyFee: number;
}
