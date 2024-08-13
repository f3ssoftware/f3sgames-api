import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Player } from '../player.entity';
import { Account } from '../../account/account.entity';

@Entity({ name: 'auctions' })
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Player, (player) => player.auction)
  @JoinColumn()
  player: Player;

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

  @OneToOne(() => Account)
  @JoinColumn()
  winnerAccount: Account;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  companyFee: number;
}
