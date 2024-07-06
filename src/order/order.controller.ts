import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './order.service';
import { PaymentMethodEnum } from './enums/payment-method.enum';
import { GenerateOrderDto } from './dto/generate-order.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pix')
  async createOrderPix(@Body() createOrderDto: GenerateOrderDto) {
    return this.paymentService.createOrder(createOrderDto, PaymentMethodEnum.PIX);
  }

  @Post('credit_card')
  async createOrderCreditCard(@Body() createOrderDto: GenerateOrderDto) {
    return this.paymentService.createOrder(createOrderDto, PaymentMethodEnum.CREDIT_CARD);
  }

  @Get(':id/status')
  async checkOrderStatus(@Param('id') id: string) {
    return this.paymentService.checkOrderStatus(id);
  }

  @Post('notification')
  async handlePaymentNotification(@Body() notificationData: any) {
    return this.paymentService.handlePaymentConfirmation(notificationData);
  }
}
