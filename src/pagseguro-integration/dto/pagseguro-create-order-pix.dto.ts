import { PagseguroCreateOrderDto } from './pagseguro-create-order.dto';

export class PagseguroCreateOrderPixDto extends PagseguroCreateOrderDto {
  qr_codes!: {
    amount: {
      value: number;
    };
    expiration_date: string;
  }[];
}
