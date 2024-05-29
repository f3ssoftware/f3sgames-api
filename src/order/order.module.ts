import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './order.service';
import { Order } from './order.entity'; 
import { PaymentController } from './order.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([Order], 'paymentConnection')],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
