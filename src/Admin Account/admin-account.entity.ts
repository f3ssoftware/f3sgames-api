import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('admin_accounts')
export class AdminAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_id: number; 

  @ManyToOne(() => Account, (account) => account.id, { eager: true })
  account: Account;
}
