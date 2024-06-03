import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { PlayerService } from '../players/player.service';
import { PagseguroIntegrationService } from '../pagseguro-integration/services/pagseguro-integration.service';
import { PagseguroCreateOrderPixDto } from '../pagseguro-integration/dto/pagseguro-create-order-pix.dto';

import { PaymentMethodEnum } from './enums/payment-method.enum';
import { OrderStatusEnum } from './enums/order-status.enum';
import { GenerateOrderDto } from './dto/generate-order.dto';
import { ProductsEnum } from './enums/products.enum';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Order, 'paymentConnection')
    private orderRepository: Repository<Order>,
    private playerService: PlayerService,
    private pagseguroIntegrationService: PagseguroIntegrationService,
  ) {}

  async createOrder(
    orderData: GenerateOrderDto,
    paymentMethod: PaymentMethodEnum,
  ): Promise<Order> {
    this.logger.log('Creating order...');
    const order = this.orderRepository.create({
      ...orderData,
      status: OrderStatusEnum.CREATED,
    });
    await this.orderRepository.save(order);

    let response;
    try {
      switch (paymentMethod) {
        case PaymentMethodEnum.PIX:
          {
            const pixOrderDto: PagseguroCreateOrderPixDto = {
              notification_urls: [`${process.env.API_URL}/webhook`],
              items: [
                {
                  name: ProductsEnum.TIBIA_COIN,
                  quantity: orderData.amount / 0.08,
                  unit_amount: 1,
                },
              ],
              reference_id: order.id,
              qr_codes: [
                {
                  amount: {
                    value: orderData.amount,
                  },
                },
              ],
              customer: {
                ...orderData.customer,
                phones: [{ ...orderData.customer.phone }],
              },
              shipping: {
                address: {
                  ...orderData.address,
                },
              },
            };
            this.logger.debug(`Pix Order DTO: ${JSON.stringify(pixOrderDto)}`);
            response =
              await this.pagseguroIntegrationService.createPixOrder(pixOrderDto);
          }
          break;
        case PaymentMethodEnum.CREDIT_CARD: {
          // Lógica para cartão de crédito
        }
      }
      order.status = OrderStatusEnum.CREATED;

      if (response.qr_codes) {
        order.qr_codes = response.qr_codes;
      }

      await this.orderRepository.save(order);

      this.logger.log('Order created successfully');
      return order;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      throw error;
    }
  }

  async checkOrderStatus(orderId: string): Promise<Order> {
    this.logger.log(`Checking order status for orderId: ${orderId}`);
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      this.logger.warn(`Order not found: ${orderId}`);
      throw new NotFoundException('Order not found');
    }

    const response = await this.pagseguroIntegrationService.checkOrderStatus(
      order.id,
    );
    order.status = response.status;
    await this.orderRepository.save(order);

    this.logger.log(`Order status updated: ${order.status}`);
    return order;
  }

  async handlePaymentConfirmation(notificationData: any): Promise<void> {
    this.logger.log('Handling payment confirmation...');
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
