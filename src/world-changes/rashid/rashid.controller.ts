import { Controller, Get } from '@nestjs/common';
import { RashidLocationService } from './rashid.service';
import { RashidCities } from './enum/rashid-cities.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('rashid')
@Controller('rashid')
export class RashidController {
  constructor(private readonly rashidLocationService: RashidLocationService) {}

  @Get('location')
  @ApiOperation({ summary: 'Get the NPC location for today' })
  @ApiResponse({ status: 200, description: 'NPC location retrieved successfully.' })
  getNpcLocation(): { city: RashidCities | null } {
    const city = this.rashidLocationService.getRashidLocation();
    return { city };
  }
}