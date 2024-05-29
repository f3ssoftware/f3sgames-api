import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { PlayerService } from '../players/player.service';
import { PagseguroIntegrationService } from '../pagseguro-integration/services/pagseguro-integration.service';
import { PagseguroCreateOrderPixDto } from '../pagseguro-integration/dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../pagseguro-integration/dto/pagseguro-create-order-creditcard.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order, 'paymentConnection')
    private orderRepository: Repository<Order>,
    private playerService: PlayerService,
    private pagseguroIntegrationService: PagseguroIntegrationService,
  ) {}

  async createOrder(orderData: Partial<Order>, paymentMethod: 'pix' | 'credit_card'): Promise<Order> {
    orderData.referenceId = uuidv4();
    const order = this.orderRepository.create(orderData);
    await this.orderRepository.save(order);

    let response;
    if (paymentMethod === 'pix') {
      const pixOrderDto: PagseguroCreateOrderPixDto = {
        ...orderData,
        reference_id: orderData.referenceId,
      } as PagseguroCreateOrderPixDto;
      response = await this.pagseguroIntegrationService.createPixOrder(pixOrderDto);
    } else {
      const creditCardOrderDto: PagseguroCreateOrderCreditCardDto = {
        ...orderData,
        reference_id: orderData.referenceId, 
      } as PagseguroCreateOrderCreditCardDto;
      response = await this.pagseguroIntegrationService.createCreditCardOrder(creditCardOrderDto);
    }

    order.status = response.status;
    if (response.qr_codes) {
      order.qr_codes = response.qr_codes;
    }
    await this.orderRepository.save(order);

    return order;
  }

  async checkOrderStatus(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Order not found');

    const response = await this.pagseguroIntegrationService.checkOrderStatus(order.referenceId);
    order.status = response.status;
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
