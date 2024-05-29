import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './order.service';
import { PagseguroCreateOrderPixDto } from '../pagseguro-integration/dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../pagseguro-integration/dto/pagseguro-create-order-creditcard.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pix')
  async createOrderPix(@Body() createOrderDto: PagseguroCreateOrderPixDto) {
    return this.paymentService.createOrder(createOrderDto, 'pix');
  }

  @Post('credit_card')
  async createOrderCreditCard(@Body() createOrderDto: PagseguroCreateOrderCreditCardDto) {
    return this.paymentService.createOrder(createOrderDto, 'credit_card');
  }

  @Get(':id/status')
  async checkOrderStatus(@Param('id') id: number) {
    return this.paymentService.checkOrderStatus(id);
  }

  @Post('notification')
  async handlePaymentNotification(@Body() notificationData: any) {
    return this.paymentService.handlePaymentConfirmation(notificationData);
  }
}
