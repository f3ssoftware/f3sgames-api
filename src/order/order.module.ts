import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './order.service';
import { PaymentController } from './order.controller';
import { PlayerModule } from '../players/player.module';
import { PagseguroIntegrationModule } from '../pagseguro-integration/pagseguro-integration.module';
import { Order } from './order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order], 'paymentConnection'),
    PlayerModule,
    PagseguroIntegrationModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
