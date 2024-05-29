import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './order.service';
import { PaymentController } from './order.controller';
import { Order } from './order.entity'
import { PlayerService } from '../players/player.service';
import { Player } from '../players/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Player]),
  ],
  providers: [PaymentService, PlayerService],
  controllers: [PaymentController],
})
export class PaymentModule {}
