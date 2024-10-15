import { Test, TestingModule } from '@nestjs/testing';
import { HousesController } from './house.controller';
import { HousesService } from './house.service';
import { FilterHousesDto } from './dto/filter-houses.dto';
import { House } from './house.entity';

describe('HousesController', () => {
  let controller: HousesController;
  let service: HousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousesController],
      providers: [
        {
          provide: HousesService,
          useValue: {
            getHouses: jest.fn().mockResolvedValue([new House()]),
          },
        },
      ],
    }).compile();

    controller = module.get<HousesController>(HousesController);
    service = module.get<HousesService>(HousesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHouses', () => {
    it('should return houses based on filters', async () => {
      const query = {
        town: 'THAIS',
        status: 'RENTED',
        order: 'BY_NAME',
      };

      const result = [new House()];
      jest.spyOn(service, 'getHouses').mockResolvedValue(result);

      expect(await controller.getHouses(query)).toBe(result);
    });
  });
});
