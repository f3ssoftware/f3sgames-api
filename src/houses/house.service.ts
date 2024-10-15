import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './house.entity';
import { FilterHousesDto } from './dto/filter-houses.dto';
import { TownNameToIdMap } from '../Shared/towns.enum';
import { Status } from './enums/status.enum';
import { Order } from './enums/order.enum';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House, 'gameConnection')
    private housesRepository: Repository<House>,
  ) {}

  async getHouses(filterHousesDto: FilterHousesDto): Promise<House[]> {
    const { town, status, order } = filterHousesDto;

    let query = this.housesRepository.createQueryBuilder('house');

    if (town) {
      const townId = TownNameToIdMap[town];
      if (townId !== undefined) {
        query = query.andWhere('house.town_id = :townId', { townId });
      }
    }

    if (status) {
      if (status === Status.FREE) {
        query = query.andWhere('house.owner = 0'); /* On databse this means the house has no owner (it needs an owner id attached to the house) */
      } else if (status === Status.RENTED) {
        query = query.andWhere('house.owner != 0');
      }
    }

    switch (order) {
      case Order.BY_NAME:
        query = query.orderBy('house.name', 'ASC');
        break;
      case Order.BY_SIZE:
        query = query.orderBy('house.size', 'ASC');
        break;
      case Order.BY_RENT:
        query = query.orderBy('house.rent', 'ASC');
        break;
      default:
        query = query.orderBy('house.name', 'ASC');
        break;
    }

    return await query.getMany();
  }
}
