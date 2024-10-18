import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_accounts')
export class AdminAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_id: number;  

  @Column({ default: false })
  god_account: boolean;
}
