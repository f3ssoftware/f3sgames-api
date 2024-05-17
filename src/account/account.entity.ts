import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from '../players/player.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column({ name: 'premdays' })
  premDays!: number;

  @Column({ name: 'premdays_purchased' })
  premDaysPurchased!: number;

  @Column()
  coins!: number;

  @Column({ name: 'coins_transferable' })
  coinsTransferable!: number; // Adicionando a propriedade coinsTransferable aqui

  @Column({ name: 'tournament_coins' })
  tournamentCoins!: number;

  @Column({ name: 'creation' })
  creation!: number;

  @Column({ name: 'recruiter' })
  recruiter!: number;

  @OneToMany(() => Player, player => player.account)
  players!: Player[];

  
}