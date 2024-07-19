/* istanbul ignore file */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'houses' })
export class House {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: number;

  @Column({ name: 'new_owner', default: -1 })
  newOwner: number;

  @Column({ default: 0 })
  paid: number;

  @Column({ default: 0 })
  warnings: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  rent: number;

  @Column({ name: 'town_id', default: 0 })
  townId: number;

  @Column({ default: 0 })
  bid: number;

  @Column({ name: 'bid_end', default: 0 })
  bidEnd: number;

  @Column({ name: 'last_bid', default: 0 })
  lastBid: number;

  @Column({ name: 'highest_bidder', default: 0 })
  highestBidder: number;

  @Column({ default: 0 })
  size: number;

  @Column({ nullable: true })
  guildid: number;

  @Column({ default: 0 })
  beds: number;
}
