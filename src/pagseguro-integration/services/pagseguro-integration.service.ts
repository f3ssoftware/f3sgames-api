import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/pagseguro-create-order.dto';
import axios from 'axios';

@Injectable()
export class PagseguroIntegrationService {
  async createPixOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const response = await axios.post(
      `${process.env.PAGSEGURO_API_URL}/orders`,
      createOrderDto,
    );
    return response.data;
  }
}
