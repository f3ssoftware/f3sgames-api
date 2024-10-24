import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Auction } from '../auction.entity';
  
  @Entity({ name: 'bids' })
  export class Bid {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Auction, (auction) => auction.bids)
    @JoinColumn()
    auction: Auction;
  
    @Column()
    bidderId: number;
  
    @Column({ type: 'integer', nullable: true })
    amount: number;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  