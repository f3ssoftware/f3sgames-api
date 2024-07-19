import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from './order.service';
import { Order } from './order.entity';
import { PlayerService } from '../players/player.service';
import { PagseguroIntegrationService } from '../pagseguro-integration/services/pagseguro-integration.service';
import { GenerateOrderDto } from './dto/generate-order.dto';
import { PaymentMethodEnum } from './enums/payment-method.enum';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ProductsEnum } from './enums/products.enum';
import { NotFoundException, HttpException } from '@nestjs/common';

describe('PaymentService', () => {
    let service: PaymentService;
    let orderRepository: Repository<Order>;
    let playerService: PlayerService;
    let pagseguroIntegrationService: PagseguroIntegrationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: getRepositoryToken(Order, 'paymentConnection'),
                    useClass: Repository,
                },
                {
                    provide: PlayerService,
                    useValue: {
                        updateTransferableCoins: jest.fn(),
                    },
                },
                {
                    provide: PagseguroIntegrationService,
                    useValue: {
                        createPixOrder: jest.fn(),
                        createCreditCardOrder: jest.fn(),
                        checkOrderStatus: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order, 'paymentConnection'));
        playerService = module.get<PlayerService>(PlayerService);
        pagseguroIntegrationService = module.get<PagseguroIntegrationService>(PagseguroIntegrationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOrder', () => {
        it('should create a Pix order successfully', async () => {
            const orderData: GenerateOrderDto = {
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
            const createdOrder = new Order();
            createdOrder.id = '1';
            createdOrder.status = OrderStatusEnum.CREATED;

            jest.spyOn(orderRepository, 'create').mockReturnValue(createdOrder);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(createdOrder);
            jest.spyOn(pagseguroIntegrationService, 'createPixOrder').mockResolvedValue({
                qr_codes: [{ amount: { value: 1000 }, expiration_date: '2024-12-31T23:59:59' }],
            });

            const result = await service.createOrder(orderData, PaymentMethodEnum.PIX);

            expect(result).toEqual(createdOrder);
            expect(orderRepository.create).toHaveBeenCalledWith({
                ...orderData,
                status: OrderStatusEnum.CREATED,
            });
            expect(orderRepository.save).toHaveBeenCalled();
            expect(pagseguroIntegrationService.createPixOrder).toHaveBeenCalled();
        });

        it('should create a Credit Card order successfully', async () => {
            const orderData: GenerateOrderDto = {
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
            const createdOrder = new Order();
            createdOrder.id = '1';
            createdOrder.status = OrderStatusEnum.CREATED;

            jest.spyOn(orderRepository, 'create').mockReturnValue(createdOrder);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(createdOrder);
            jest.spyOn(pagseguroIntegrationService, 'createCreditCardOrder').mockResolvedValue({
                qr_codes: [{ amount: { value: 1000 }, expiration_date: '2024-12-31T23:59:59' }],
            });

            const result = await service.createOrder(orderData, PaymentMethodEnum.CREDIT_CARD);

            expect(result).toEqual(createdOrder);
            expect(orderRepository.create).toHaveBeenCalledWith({
                ...orderData,
                status: OrderStatusEnum.CREATED,
            });
            expect(orderRepository.save).toHaveBeenCalled();
            expect(pagseguroIntegrationService.createCreditCardOrder).toHaveBeenCalled();
        });

        it('should throw an error when creating a Pix order fails', async () => {
            const orderData: GenerateOrderDto = {
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

            jest.spyOn(orderRepository, 'create').mockReturnValue(new Order());
            jest.spyOn(orderRepository, 'save').mockResolvedValue(new Order());
            jest.spyOn(pagseguroIntegrationService, 'createPixOrder').mockRejectedValue(new HttpException('Error', 400));

            await expect(service.createOrder(orderData, PaymentMethodEnum.PIX)).rejects.toThrow(HttpException);
        });

        it('should throw an error when creating a Credit Card order fails', async () => {
            const orderData: GenerateOrderDto = {
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

            jest.spyOn(orderRepository, 'create').mockReturnValue(new Order());
            jest.spyOn(orderRepository, 'save').mockResolvedValue(new Order());
            jest.spyOn(pagseguroIntegrationService, 'createCreditCardOrder').mockRejectedValue(new HttpException('Error', 400));

            await expect(service.createOrder(orderData, PaymentMethodEnum.CREDIT_CARD)).rejects.toThrow(HttpException);
        });

        it('should log a warning if qr_codes are missing in the response', async () => {
            const orderData: GenerateOrderDto = {
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
            const createdOrder = new Order();
            createdOrder.id = '1';
            createdOrder.status = OrderStatusEnum.CREATED;

            jest.spyOn(orderRepository, 'create').mockReturnValue(createdOrder);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(createdOrder);
            jest.spyOn(pagseguroIntegrationService, 'createPixOrder').mockResolvedValue({});

            const loggerWarnSpy = jest.spyOn(service['logger'], 'warn');

            await service.createOrder(orderData, PaymentMethodEnum.PIX);

            expect(loggerWarnSpy).toHaveBeenCalledWith('Missing qr_codes in response');
        });
    });

    describe('checkOrderStatus', () => {
        it('should check order status successfully', async () => {
            const order = new Order();
            order.id = '1';
            order.status = OrderStatusEnum.CREATED;

            jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(order);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(order);
            jest.spyOn(pagseguroIntegrationService, 'checkOrderStatus').mockResolvedValue({ status: OrderStatusEnum.APPROVED });

            const loggerLogSpy = jest.spyOn(service['logger'], 'log');

            const result = await service.checkOrderStatus(order.id);

            expect(result.status).toBe(OrderStatusEnum.APPROVED);
            expect(orderRepository.save).toHaveBeenCalled();
            expect(loggerLogSpy).toHaveBeenCalledWith(`Order status updated: ${OrderStatusEnum.APPROVED}`);
            expect(result).toBe(order);
        });

        it('should throw NotFoundException if order is not found', async () => {
            jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(undefined);

            await expect(service.checkOrderStatus('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('handlePaymentConfirmation', () => {
        it('should handle payment confirmation successfully', async () => {
            const notificationData = {
                reference_id: '1',
                status: 'APPROVED',
            };
            const order = new Order();
            order.id = '1';
            order.customer = {
                name: 'Romario',
                email: 'romario@example.com',
                tax_id: '12345678909',
                phones: [],
            };
            order.items = [{ name: 'Product 1', quantity: 10, unit_amount: 100 }];

            jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(order);
            const updateTransferableCoinsSpy = jest.spyOn(playerService, 'updateTransferableCoins').mockResolvedValue(undefined);

            await service.handlePaymentConfirmation(notificationData);

            expect(updateTransferableCoinsSpy).toHaveBeenCalledWith(order.customer.name, order.items[0].quantity);
        });

        it('should not update transferable coins if order is not found', async () => {
            const notificationData = {
                reference_id: '1',
                status: 'APPROVED',
            };

            jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(undefined);
            const updateTransferableCoinsSpy = jest.spyOn(playerService, 'updateTransferableCoins').mockResolvedValue(undefined);

            await service.handlePaymentConfirmation(notificationData);

            expect(updateTransferableCoinsSpy).not.toHaveBeenCalled();
        });
    });
});