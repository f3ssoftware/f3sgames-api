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

//   it('should check a null day', () => {
//     const date = null;
//     expect(service.getRashidLocation()).toBe(cityByDay[date]);
//   })

  it('should return the correct city for each day of the week', () => {
    const cityByDay = {
      0: RashidCities.CARLIN,
      1: RashidCities.SVARGROND,
      2: RashidCities.LIBERTY_BAY,
      3: RashidCities.PORT_HOPE,
      4: RashidCities.ANKRAHMUN,
      5: RashidCities.DARASHIA,
      6: RashidCities.EDRON,
      7: null,
    };
    
    for (let day = 0; day <=7; day++) {
  
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        getDay: () => day,
      }) as any);
      expect(service.getRashidLocation()).toBe(cityByDay[day]);
    }
  });
});
