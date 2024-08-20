import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Player } from '../players/player.entity';

@Entity({ name: 'market_offers' })
export class MarketOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column()
  sale: boolean;

  @Column()
  itemtype: number;

  @Column()
  amount: number;

  @Column()
  created: number;

  @Column()
  anonymous: boolean;

  @Column()
  price: number;

  @Column()
  tier: number;

  @ManyToOne(() => Player, (player) => player.marketOffers) 
  @JoinColumn({ name: 'player_id' })  
  player: Player;
}
