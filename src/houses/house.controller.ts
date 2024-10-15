import { Controller, Get, Query } from '@nestjs/common';
import { HousesService } from './house.service';
import { FilterHousesDto } from './dto/filter-houses.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { House } from './house.entity';
import { TownNameToIdMap } from '../Shared/towns.enum';
import { Status } from './enums/status.enum';
import { Order } from './enums/order.enum';

@ApiTags('houses')
@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  @ApiOperation({ summary: 'Get houses based on filters' })
  @ApiResponse({ status: 200, description: 'Houses retrieved successfully.' })
  @ApiQuery({
    name: 'town',
    required: true, /* Need to be on true since there's no option of no city selected on our application */
    enum: Object.keys(TownNameToIdMap).filter(town => town !== 'NO_TOWN' && town !== 'TUTORIAL_CITY'), /* Even though I have these towns on towns.enum, 
    I don't need them for this endpoint */
    description: 'City Name',
  })
  @ApiQuery({ name: 'status', enum: Status })
  @ApiQuery({ name: 'order', enum: Order })
  async getHouses(@Query() query: { town: string, status: string, order: string }): Promise<House[]> {
    const town = query.town
    const status = query.status as Status;
    const order = query.order as Order;

    const filterHousesDto: FilterHousesDto = {
      town,
      status,
      order,
    };

    return this.housesService.getHouses(filterHousesDto);
  }
}
