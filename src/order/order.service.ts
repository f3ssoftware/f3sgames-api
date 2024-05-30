import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { PlayerService } from '../players/player.service';
import { PagseguroIntegrationService } from '../pagseguro-integration/services/pagseguro-integration.service';
import { PagseguroCreateOrderPixDto } from '../pagseguro-integration/dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../pagseguro-integration/dto/pagseguro-create-order-creditcard.dto';

import { PaymentMethodEnum } from './enums/payment-method.enum';
import { OrderStatusEnum } from './enums/order-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order, 'paymentConnection')
    private orderRepository: Repository<Order>,
    private playerService: PlayerService,
    private pagseguroIntegrationService: PagseguroIntegrationService,
  ) {}

  async createOrder(
    orderData: Partial<Order>,
    paymentMethod: PaymentMethodEnum,
  ): Promise<Order> {
    const order = this.orderRepository.create({
      ...orderData,
      status: OrderStatusEnum.CREATED,
    });
    await this.orderRepository.save(order);

    let response;
    switch (paymentMethod) {
      case PaymentMethodEnum.PIX:
        {
          const pixOrderDto: PagseguroCreateOrderPixDto = {
            ...orderData,
            reference_id: order.id,
          } as PagseguroCreateOrderPixDto;
          response =
            await this.pagseguroIntegrationService.createPixOrder(pixOrderDto);
        }
        break;
      case PaymentMethodEnum.CREDIT_CARD: {
        const creditCardOrderDto: PagseguroCreateOrderCreditCardDto = {
          ...orderData,
          reference_id: order.id,
        } as PagseguroCreateOrderCreditCardDto;
        response =
          await this.pagseguroIntegrationService.createCreditCardOrder(
            creditCardOrderDto,
          );
      }
    }

    order.status = OrderStatusEnum.CREATED;

    if (response.qr_codes) {
      order.qr_codes = response.qr_codes;
    }

    await this.orderRepository.save(order);

    return order;
  }

  async checkOrderStatus(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Order not found');

    const response = await this.pagseguroIntegrationService.checkOrderStatus(
      order.id,
    );
    order.status = response.status;
    await this.orderRepository.save(order);

    return order;
  }

  async handlePaymentConfirmation(notificationData: any): Promise<void> {
    const order = await this.orderRepository.findOneBy({
      id: notificationData.reference_id,
    });
    if (order && notificationData.status === 'APPROVED') {
      await this.playerService.updateTransferableCoins(
        order.customer.name,
        order.items[0].quantity,
      );
    }
  }
}
