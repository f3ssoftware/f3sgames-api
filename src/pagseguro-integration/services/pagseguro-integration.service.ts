import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PagseguroCreateOrderPixDto } from '../dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../dto/pagseguro-create-order-creditcard.dto';
import axios from 'axios';

@Injectable()
export class PagseguroIntegrationService {
  private readonly logger = new Logger(PagseguroIntegrationService.name);

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
      this.logger.error('Error creating Pix order', err.message);
      const statusCode = err.response?.status || 500;
      const message = err.response?.data || 'Erro comunicação com PagSeguro';
      throw new HttpException(message, statusCode);
    }
  }

  async createCreditCardOrder(
    createOrderDto: PagseguroCreateOrderCreditCardDto,
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
      this.logger.error('Error creating Credit Card order', err.message);
      const statusCode = err.response?.status || 500;
      const message = err.response?.data || 'Erro comunicação com PagSeguro';
      throw new HttpException(message, statusCode);
    }
  }

  async checkOrderStatus(referenceId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.PAGBANK_API_URL}/orders/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
          },
        },
      );
      return response.data;
    } catch (err) {
      this.logger.error('Error checking order status', err.message);
      const statusCode = err.response?.status || 500;
      const message = err.response?.data || 'Erro comunicação com PagSeguro';
      throw new HttpException(message, statusCode);
    }
  }
}
