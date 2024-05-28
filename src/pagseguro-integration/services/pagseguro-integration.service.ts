import { Injectable } from '@nestjs/common';
import { PagseguroCreateOrderPixDto } from '../dto/pagseguro-create-order-pix.dto';
import axios from 'axios';
import { PagseguroCreateOrderCreditCardDto } from '../dto/pagseguro-create-order-creditcard.dto';

@Injectable()
export class PagseguroIntegrationService {
  async createPixOrder(
    createOrderDto: PagseguroCreateOrderPixDto,
  ): Promise<any> {
    const response = await axios.post(
      `${process.env.PAGSEGURO_API_URL}/orders`,
      createOrderDto,
    );
    return response.data;
  }

  async createCreditCardOrder(
    createOrderDto: PagseguroCreateOrderCreditCardDto,
  ): Promise<any> {
    return createOrderDto;
  }
}
