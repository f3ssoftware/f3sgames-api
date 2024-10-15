import { Test, TestingModule } from '@nestjs/testing';
import { HousesService } from './house.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { House } from './house.entity';
import { Repository } from 'typeorm';
import { FilterHousesDto } from './dto/filter-houses.dto';
import { Status } from './enums/status.enum';
import { Order } from './enums/order.enum';

describe('HousesService', () => {
  let service: HousesService;
  let repository: Repository<House>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HousesService,
        {
          provide: getRepositoryToken(House, 'gameConnection'),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HousesService>(HousesService);
    repository = module.get<Repository<House>>(getRepositoryToken(House, 'gameConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHouses', () => {
    it('should return houses based on filters', async () => {
      const filterHousesDto: FilterHousesDto = {
        town: 'THAIS',
        status: Status.RENTED,
        order: Order.BY_NAME,
      };

      const houses = [new House()];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(houses),
      } as any);

      expect(await service.getHouses(filterHousesDto)).toEqual(houses);
    });

    it('should handle no town filter', async () => {
      const filterHousesDto: FilterHousesDto = {
        town: undefined,
        status: Status.RENTED,
        order: Order.BY_NAME,
      };

      const houses = [new House()];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(houses),
      } as any);

      expect(await service.getHouses(filterHousesDto)).toEqual(houses);
    });

    it('should handle FREE status filter', async () => {
      const filterHousesDto: FilterHousesDto = {
        town: 'THAIS',
        status: Status.FREE,
        order: Order.BY_NAME,
      };

      const houses = [new House()];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(houses),
      } as any);

      expect(await service.getHouses(filterHousesDto)).toEqual(houses);
    });

    it('should handle order by size', async () => {
      const filterHousesDto: FilterHousesDto = {
        town: 'THAIS',
        status: Status.RENTED,
        order: Order.BY_SIZE,
      };

      const houses = [new House()];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(houses),
      } as any);

      expect(await service.getHouses(filterHousesDto)).toEqual(houses);
    });

    it('should handle order by rent', async () => {
      const filterHousesDto: FilterHousesDto = {
        town: 'THAIS',
        status: Status.RENTED,
        order: Order.BY_RENT,
      };

      const houses = [new House()];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(houses),
      } as any);

      expect(await service.getHouses(filterHousesDto)).toEqual(houses);
    });

    it('should handle default order by name', async () => {
      const filterHousesDto: FilterHousesDto = {
        town: 'THAIS',
        status: Status.RENTED,
        order: undefined,
      };

      const houses = [new House()];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(houses),
      } as any);

      expect(await service.getHouses(filterHousesDto)).toEqual(houses);
    });
  });
});
