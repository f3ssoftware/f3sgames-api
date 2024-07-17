import { Test, TestingModule } from '@nestjs/testing';
import { PagseguroIntegrationService } from './pagseguro-integration.service';
import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { PagseguroCreateOrderPixDto } from '../dto/pagseguro-create-order-pix.dto';
import { PagseguroCreateOrderCreditCardDto } from '../dto/pagseguro-create-order-creditcard.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PagseguroIntegrationService', () => {
  let service: PagseguroIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagseguroIntegrationService],
    }).compile();

    service = module.get<PagseguroIntegrationService>(
      PagseguroIntegrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPixOrder', () => {
    it('should create a Pix order successfully', async () => {
      const createOrderDto: PagseguroCreateOrderPixDto = {
        qr_codes: [{ amount: { value: 1000 }, expiration_date: '2024-12-31T23:59:59' }],
        items: [{ name: 'Product 1', quantity: 1, unit_amount: 1000 }],
        customer: { name: 'Reginaldo', email: 'reginaldoRossi@example.com', tax_id: '12345678909', phones: [] },
        shipping: { address: { street: 'Street 1', number: '123', complement: '', locality: 'City', city: 'City', region_code: 'State', country: 'BRA', postal_code: '12345678' } },
        notification_urls: ['https://example.com/notification'],
        reference_id: 'order123'
      };
      const responseData = { data: 'mockResponse' };
      mockedAxios.post.mockResolvedValue({ data: responseData });

      const result = await service.createPixOrder(createOrderDto);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.PAGBANK_API_URL}/orders`,
        createOrderDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should throw an HttpException when creating a Pix order fails', async () => {
      const createOrderDto: PagseguroCreateOrderPixDto = {
        qr_codes: [{ amount: { value: 1000 }, expiration_date: '2024-12-31T23:59:59' }],
        items: [{ name: 'Product 1', quantity: 1, unit_amount: 1000 }],
        customer: { name: 'Reginaldo', email: 'reginaldoRossi@example.com', tax_id: '12345678909', phones: [] },
        shipping: { address: { street: 'Street 1', number: '123', complement: '', locality: 'City', city: 'City', region_code: 'State', country: 'BRA', postal_code: '12345678' } },
        notification_urls: ['https://example.com/notification'],
        reference_id: 'order123'
      };
      const errorResponse = {
        response: {
          status: 400,
          data: 'errorData',
        },
        message: 'Error message',
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(service.createPixOrder(createOrderDto)).rejects.toThrow(
        new HttpException('errorData', 400),
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.PAGBANK_API_URL}/orders`,
        createOrderDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });

  describe('createCreditCardOrder', () => {
    it('should create a Credit Card order successfully', async () => {
      const createOrderDto: PagseguroCreateOrderCreditCardDto = {
        reference_id: 'order123',
        customer: { name: 'Regina Cazé', email: 'regina@example.com', tax_id: '12345678909', phones: [] },
        items: [{ name: 'Product 1', quantity: 1, unit_amount: 1000 }],
        shipping: { address: { street: 'Street 1', number: '123', complement: '', locality: 'City', city: 'City', region_code: 'State', country: 'BRA', postal_code: '12345678' } },
        notification_urls: ['https://example.com/notification'],
        charges: [{
          reference_id: 'charge123',
          description: 'Order description',
          amount: { value: 1000, currency: 'BRL' },
          payment_method: { type: 'CREDIT_CARD', installments: 1, capture: true, soft_descriptor: 'Store', card: { number: '4111111111111111', exp_month: '12', exp_year: '2024', security_code: '123', holder: { name: 'John Doe', tax_id: '12345678909' } } },
          notification_urls: ['https://example.com/notification']
        }]
      };
      const responseData = { data: 'mockResponse' };
      mockedAxios.post.mockResolvedValue({ data: responseData });

      const result = await service.createCreditCardOrder(createOrderDto);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.PAGBANK_API_URL}/orders`,
        createOrderDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should throw an HttpException when creating a Credit Card order fails', async () => {
      const createOrderDto: PagseguroCreateOrderCreditCardDto = {
        reference_id: 'order123',
        customer: { name: 'Cejana', email: 'cejana@example.com', tax_id: '12345678909', phones: [] },
        items: [{ name: 'Product 1', quantity: 1, unit_amount: 1000 }],
        shipping: { address: { street: 'Street 1', number: '123', complement: '', locality: 'City', city: 'City', region_code: 'State', country: 'BRA', postal_code: '12345678' } },
        notification_urls: ['https://example.com/notification'],
        charges: [{
          reference_id: 'charge123',
          description: 'Order description',
          amount: { value: 1000, currency: 'BRL' },
          payment_method: { type: 'CREDIT_CARD', installments: 1, capture: true, soft_descriptor: 'Store', card: { number: '4111111111111111', exp_month: '12', exp_year: '2024', security_code: '123', holder: { name: 'John Doe', tax_id: '12345678909' } } },
          notification_urls: ['https://example.com/notification']
        }]
      };
      const errorResponse = {
        response: {
          status: 400,
          data: 'errorData',
        },
        message: 'Error message',
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(service.createCreditCardOrder(createOrderDto)).rejects.toThrow(
        new HttpException('errorData', 400),
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.PAGBANK_API_URL}/orders`,
        createOrderDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });

  describe('checkOrderStatus', () => {
    it('should check order status successfully', async () => {
      const referenceId = '12345';
      const responseData = { data: 'mockResponse' };
      mockedAxios.get.mockResolvedValue({ data: responseData });

      const result = await service.checkOrderStatus(referenceId);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.PAGBANK_API_URL}/orders/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
          },
        },
      );
    });

    it('should throw an HttpException when checking order status fails', async () => {
      const referenceId = '12345';
      const errorResponse = {
        response: {
          status: 404,
          data: 'errorData',
        },
        message: 'Error message',
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(service.checkOrderStatus(referenceId)).rejects.toThrow(
        new HttpException('errorData', 404),
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.PAGBANK_API_URL}/orders/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
          },
        },
      );
    });
  });
});
