import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order } from './order.entity';
import { PaymentModule } from './order.module';
import { PlayerModule } from '../players/player.module';
import { PagseguroIntegrationModule } from '../pagseguro-integration/pagseguro-integration.module';

describe('OrderModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forFeature([Order], 'paymentConnection'),
        PaymentModule,
        PlayerModule,
        PagseguroIntegrationModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    const app = module.get<PaymentModule>(PaymentModule);
    expect(app).toBeDefined();
  });
});
