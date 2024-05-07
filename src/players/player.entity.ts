import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../account/account.entity'

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  accountId: number;

  @ManyToOne(() => Account, account => account.players)
  account: Account;

}