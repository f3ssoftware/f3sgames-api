import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Player, player => player.account)
  players: Player[];

  
}