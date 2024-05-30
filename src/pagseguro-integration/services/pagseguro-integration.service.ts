import { HttpException, Injectable } from '@nestjs/common';
import { PagseguroCreateOrderPixDto } from '../dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../dto/pagseguro-create-order-creditcard.dto';
import axios from 'axios';

@Injectable()
export class PagseguroIntegrationService {
  constructor() {}

  async createPixOrder(
    createOrderDto: PagseguroCreateOrderPixDto,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.PAGBANK_API_URL}/orders`,
        createOrderDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      console.log(`${process.env.PAGBANK_API_URL}/orders`);
      console.log(JSON.stringify(createOrderDto));
      console.log(err);
      throw new HttpException(err?.response?.data, 500, {
        description: 'Erro comunicação com PagSeguro',
      });
    }
  }

  async createCreditCardOrder(
    createOrderDto: PagseguroCreateOrderCreditCardDto,
  ): Promise<any> {
    const response = await axios.post(
      `${process.env.PAGBANK_API_URL}/orders`,
      createOrderDto,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  async checkOrderStatus(referenceId: string): Promise<any> {
    const response = await axios.get(
      `${process.env.PAGBANK_API_URL}/orders/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
        },
      },
    );
    return response.data;
  }
}
