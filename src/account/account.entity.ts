import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { Player } from '../players/player.entity';
import * as argon2 from 'argon2';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ name: 'country', type: 'varchar', length: 2 })
  country: string;

  @Column({ name: 'premdays' })
  premDays: number;

  @Column({ name: 'premdays_purchased' })
  premDaysPurchased: number;

  @Column()
  coins: number;

  @Column({ name: 'coins_transferable' })
  coinsTransferable: number;

  @Column({ name: 'tournament_coins' })
  tournamentCoins: number;

  @Column({ name: 'creation' })
  creation: number;

  @Column({ name: 'recruiter' })
  recruiter: number;

  @OneToMany(() => Player, (player) => player.account)
  players: Player[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
