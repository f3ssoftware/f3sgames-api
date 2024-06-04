import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('players') 
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Account, (account) => account.players)
  account: Account;
}
