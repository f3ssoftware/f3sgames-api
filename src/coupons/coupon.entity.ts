import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  influencerName: string;

  @Column()
  influencerEmail: string;

  @Column()
  influencerBirthdate: Date;

  @Column()
  influencerDocument: string;

  @Column()
  pixKey: string;

  @Column()
  socialNetwork: string;

  @Column()
  socialNetworkProfile: string;

  @Column('decimal', { precision: 10, scale: 2 })
  minimumQuote: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
