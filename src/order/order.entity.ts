import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceId: string;

  @Column('jsonb')
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: {
      country: string;
      area: string;
      number: string;
      type: string;
    }[];
  };

  @Column('jsonb')
  items: {
    name: string;
    quantity: number;
    unit_amount: number;
  }[];

  @Column('jsonb', { nullable: true })
  qr_codes?: {
    amount: {
      value: number;
    };
    expiration_date: string;
  }[];

  @Column('jsonb')
  shipping: {
    address: {
      street: string;
      number: string;
      complement: string;
      locality: string;
      city: string;
      region_code: string;
      country: string;
      postal_code: string;
    };
  };

  @Column('jsonb', { nullable: true })
  notification_urls?: string[];

  @Column('jsonb')
  charges?: {
    reference_id: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: string;
      installments: number;
      capture: boolean;
      soft_descriptor: string;
      card: {
        number: string;
        exp_month: string;
        exp_year: string;
        security_code: string;
        holder: {
          name: string;
          tax_id: string;
        };
      };
    };
    sub_merchant?: {
      reference_id: string;
      name: string;
      tax_id: string;
      mcc: string;
      address: {
        country: string;
        region_code: string;
        city: string;
        postal_code: string;
        street: string;
        number: string;
        locality: string;
        complement: string;
      };
      phones: {
        country: string;
        area: string;
        number: string;
        type: string;
      }[];
    };
    notification_urls: string[];
  }[];

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
