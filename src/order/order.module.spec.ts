import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './order.service';
import { PaymentController } from './order.controller';
import { Order } from './order.entity';
import { PlayerModule } from '../players/player.module';
import { PagseguroIntegrationModule } from '../pagseguro-integration/pagseguro-integration.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentModule } from './order.module';

describe('PaymentModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Order], 'paymentConnection'),
        PlayerModule,
        PagseguroIntegrationModule,
      ],
      controllers: [PaymentController],
      providers: [PaymentService],
    })
      .overrideProvider(getRepositoryToken(Order, 'paymentConnection'))
      .useClass(Repository)
      .compile();
  });

  it('should be defined', () => {
    const paymentModule = testingModule.get<PaymentModule>(PaymentModule);
    expect(paymentModule).toBeDefined();
  });

  it('should have PaymentService', () => {
    const service = testingModule.get<PaymentService>(PaymentService);
    expect(service).toBeDefined();
  });

  it('should have PaymentController', () => {
    const controller = testingModule.get<PaymentController>(PaymentController);
    expect(controller).toBeDefined();
  });
});

