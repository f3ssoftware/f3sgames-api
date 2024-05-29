import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './order.service';
import { PagseguroCreateOrderPixDto } from '../pagseguro-integration/dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../pagseguro-integration/dto/pagseguro-create-order-creditcard.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {    
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pix')
  @ApiOperation({ summary: 'Create an order for Pix payment' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: PagseguroCreateOrderPixDto })
  async createOrderPix(@Body() createOrderDto: PagseguroCreateOrderPixDto) {
    return this.paymentService.createOrder(createOrderDto, 'pix');
  }

  @Post('credit_card')
  @ApiOperation({ summary: 'Create an order for credit card payment' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: PagseguroCreateOrderCreditCardDto })
  async createOrderCreditCard(@Body() createOrderDto: PagseguroCreateOrderCreditCardDto) {
    return this.paymentService.createOrder(createOrderDto, 'credit_card');
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Check the status of an order' })
  @ApiResponse({ status: 200, description: 'Order status retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiParam({ name: 'id', required: true, description: 'Order ID' })
  async checkOrderStatus(@Param('id') id: number) {
    return this.paymentService.checkOrderStatus(id);
  }

  @Post('notification')
  @ApiOperation({ summary: 'Handle payment notification' })
  @ApiResponse({ status: 200, description: 'Notification handled successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid notification data.' })
  async handlePaymentNotification(@Body() notificationData: any) {
    return this.paymentService.handlePaymentConfirmation(notificationData);
  }
}
