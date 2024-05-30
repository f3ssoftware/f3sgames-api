import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './order.service';
import { PagseguroCreateOrderPixDto } from '../pagseguro-integration/dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../pagseguro-integration/dto/pagseguro-create-order-creditcard.dto';
import { PaymentMethodEnum } from './enums/payment-method.enum';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pix')
  async createOrderPix(@Body() createOrderDto: PagseguroCreateOrderPixDto) {
    return this.paymentService.createOrder(
      createOrderDto,
      PaymentMethodEnum.PIX,
    );
  }

  @Post('credit_card')
  async createOrderCreditCard(
    @Body() createOrderDto: PagseguroCreateOrderCreditCardDto,
  ) {
    return this.paymentService.createOrder(
      createOrderDto,
      PaymentMethodEnum.CREDIT_CARD,
    );
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
