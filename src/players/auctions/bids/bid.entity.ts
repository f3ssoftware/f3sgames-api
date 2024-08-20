import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Auction } from '../auction.entity';
  import { Account } from '../../../account/account.entity';
  
  @Entity({ name: 'bids' })
  export class Bid {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Auction, (auction) => auction.bids)
    @JoinColumn()
    auction: Auction;
  
    @Column()
    bidderId: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  