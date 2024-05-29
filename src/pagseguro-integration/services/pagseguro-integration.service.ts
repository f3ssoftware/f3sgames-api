import { Injectable } from '@nestjs/common';
import { PagseguroCreateOrderPixDto } from '../dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../dto/pagseguro-create-order-creditcard.dto';
import axios from 'axios';

@Injectable()
export class PagseguroIntegrationService {
  private readonly pagBankApiUrl: string;
  private readonly pagBankApiToken: string;

  constructor() {
    this.pagBankApiUrl = process.env.PAGBANK_API_URL || 'https://api.pagbank.uol.com.br';
    this.pagBankApiToken = process.env.PAGBANK_API_TOKEN || '';
  }

  async createPixOrder(createOrderDto: PagseguroCreateOrderPixDto): Promise<any> {
    const response = await axios.post(
      `${this.pagBankApiUrl}/orders`,
      createOrderDto,
      {
        headers: {
          Authorization: `Bearer ${this.pagBankApiToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  async createCreditCardOrder(createOrderDto: PagseguroCreateOrderCreditCardDto): Promise<any> {
    const response = await axios.post(
      `${this.pagBankApiUrl}/orders`,
      createOrderDto,
      {
        headers: {
          Authorization: `Bearer ${this.pagBankApiToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  async checkOrderStatus(referenceId: string): Promise<any> {
    const response = await axios.get(
      `${this.pagBankApiUrl}/orders/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${this.pagBankApiToken}`,
        },
      },
    );
    return response.data;
  }
}
