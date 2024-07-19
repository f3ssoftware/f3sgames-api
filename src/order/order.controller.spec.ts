import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './order.controller';
import { PaymentService } from './order.service';
import { GenerateOrderDto } from './dto/generate-order.dto';
import { PaymentMethodEnum } from './enums/payment-method.enum';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    createOrder: jest.fn(),
    checkOrderStatus: jest.fn(),
    handlePaymentConfirmation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrderPix', () => {
    it('should call createOrder with PIX method', async () => {
      const dto: GenerateOrderDto = {
        player_id: 1,
        amount: 100,
        customer: {
          name: 'Romario',
          email: 'romario@example.com',
          tax_id: '12345678909',
          phones: [
            { country: '55', area: '61', number: '982638893', type: 'mobile' },
          ],
        },
        address: {
          street: 'Street 1',
          number: '123',
          complement: '',
          locality: 'City',
          city: 'City',
          region_code: 'State',
          country: 'BRA',
          postal_code: '12345678',
        },
      };
      await controller.createOrderPix(dto);
      expect(service.createOrder).toHaveBeenCalledWith(dto, PaymentMethodEnum.PIX);
    });
  });

  describe('createOrderCreditCard', () => {
    it('should call createOrder with CREDIT_CARD method', async () => {
      const dto: GenerateOrderDto = {
        player_id: 1,
        amount: 100,
        customer: {
          name: 'Romario',
          email: 'romario@example.com',
          tax_id: '12345678909',
          phones: [
            { country: '55', area: '61', number: '982638893', type: 'mobile' },
          ],
        },
        address: {
          street: 'Street 1',
          number: '123',
          complement: '',
          locality: 'City',
          city: 'City',
          region_code: 'State',
          country: 'BRA',
          postal_code: '12345678',
        },
        card: {
          number: '4111111111111111',
          exp_month: '12',
          exp_year: '2024',
          security_code: '123',
          holder: {
            name: 'Romario',
            tax_id: '12345678909',
          },
        },
      };
      await controller.createOrderCreditCard(dto);
      expect(service.createOrder).toHaveBeenCalledWith(dto, PaymentMethodEnum.CREDIT_CARD);
    });
  });

  describe('checkOrderStatus', () => {
    it('should call checkOrderStatus with given id', async () => {
      const id = '1';
      await controller.checkOrderStatus(id);
      expect(service.checkOrderStatus).toHaveBeenCalledWith(id);
    });
  });

  describe('handlePaymentNotification', () => {
    it('should call handlePaymentConfirmation with notification data', async () => {
      const notificationData = {
        reference_id: '1',
        status: 'APPROVED',
      };
      await controller.handlePaymentNotification(notificationData);
      expect(service.handlePaymentConfirmation).toHaveBeenCalledWith(notificationData);
    });
  });
});
