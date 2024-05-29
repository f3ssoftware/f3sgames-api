import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { PlayerService } from '../../players/player.service';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly pagBankApiUrl = 'https://api.pagbank.uol.com.br';

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private playerService: PlayerService, // Injete o PlayerService aqui
  ) {}

  async createOrder(orderData: Partial<Order>, paymentMethod: 'pix' | 'credit_card'): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    await this.orderRepository.save(order);

    const endpoint = paymentMethod === 'pix' ? 'pix' : 'credit_card';

    const response = await axios.post(`${this.pagBankApiUrl}/order`, orderData, {
      headers: {
        Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    order.status = response.data.status;
    if (response.data.qr_codes) {
      order.qr_codes = response.data.qr_codes;
    }
    await this.orderRepository.save(order);

    return order;
  }

  async checkOrderStatus(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Order not found');

    const response = await axios.get(`${this.pagBankApiUrl}/order/${order.referenceId}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
      },
    });

    order.status = response.data.status;
    await this.orderRepository.save(order);

    return order;
  }

  async handlePaymentConfirmation(notificationData: any): Promise<void> {
    const order = await this.orderRepository.findOneBy({ referenceId: notificationData.reference_id });
    if (order && notificationData.status === 'APPROVED') {
      await this.playerService.updateTransferableCoins(order.customer.name, order.items[0].quantity);
    }
  }
}
