import { Test, TestingModule } from '@nestjs/testing';
import { RashidController } from './rashid.controller';
import { RashidLocationService } from './rashid.service';
import { RashidCities } from './enum/rashid-cities.enum';

describe('RashidController', () => {
  let rashidController: RashidController;
  let rashidLocationService: RashidLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RashidController],
      providers: [RashidLocationService],
    }).compile();

    rashidController = module.get<RashidController>(RashidController);
    rashidLocationService = module.get<RashidLocationService>(RashidLocationService);
  });

  it('should be defined', () => {
    expect(rashidController).toBeDefined();
  });

  it('should return the correct city based on the day of the week', () => {
    jest.spyOn(rashidLocationService, 'getRashidLocation').mockImplementation(() => RashidCities.CARLIN);
    expect(rashidController.getNpcLocation()).toEqual({ city: RashidCities.CARLIN });
  });
});
