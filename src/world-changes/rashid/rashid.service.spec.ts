import { Test, TestingModule } from '@nestjs/testing';
import { RashidLocationService } from './rashid.service';
import { RashidCities } from './enum/rashid-cities.enum';

describe('RashidLocationService', () => {
  let service: RashidLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RashidLocationService],
    }).compile();

    service = module.get<RashidLocationService>(RashidLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct city for each day of the week before 6 AM', () => {
    const cityByDayBefore6AM = {
      0: RashidCities.EDRON, // Before 6 AM on Sunday, it should return the city for Saturday
      1: RashidCities.CARLIN,
      2: RashidCities.SVARGROND,
      3: RashidCities.LIBERTY_BAY,
      4: RashidCities.PORT_HOPE,
      5: RashidCities.ANKRAHMUN,
      6: RashidCities.DARASHIA,
    };

    Object.keys(cityByDayBefore6AM).forEach(day => {
      const mockDate = new Date(Date.UTC(2024, 0, parseInt(day), 5)); // 5 AM UTC (2 AM Brasília)
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      console.log(`Mock Date: ${mockDate}, Expected City: ${cityByDayBefore6AM[day]}`);
      expect(service.getRashidLocation()).toBe(cityByDayBefore6AM[day]);
      jest.restoreAllMocks(); // Restore the original Date behavior after each iteration
    });
  });

  it('should return the correct city for each day of the week after 6 AM', () => {
    const cityByDayAfter6AM = {
      0: RashidCities.CARLIN,
      1: RashidCities.SVARGROND,
      2: RashidCities.LIBERTY_BAY,
      3: RashidCities.PORT_HOPE,
      4: RashidCities.ANKRAHMUN,
      5: RashidCities.DARASHIA,
      6: RashidCities.EDRON,
    };

    Object.keys(cityByDayAfter6AM).forEach(day => {
      const mockDate = new Date(Date.UTC(2024, 0, parseInt(day), 9)); // 9 AM UTC (6 AM Brasília)
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      console.log(`Mock Date: ${mockDate}, Expected City: ${cityByDayAfter6AM[day]}`);
      expect(service.getRashidLocation()).toBe(cityByDayAfter6AM[day]);
      jest.restoreAllMocks(); // Restore the original Date behavior after each iteration
    });
  });

  it('should return null for an invalid day', () => {
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      getUTCHours: () => 10, // Force an hour that won't change the day
      getUTCDay: () => 7, // Invalid day (out of normal range)
      getDate: () => 8,
    }) as any);
    expect(service.getRashidLocation()).toBeNull();
    jest.restoreAllMocks(); // Restore the original Date behavior
  });
});
