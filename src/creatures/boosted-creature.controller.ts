import { Controller, Get, UseGuards } from '@nestjs/common';
import { BoostedCreatureService } from './boosted-creature.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoostedCreature } from './boosted-creature.entity';

@ApiTags('boosted-creature')
@Controller('boosted-creature')
export class BoostedCreatureController {
  constructor(private readonly boostedCreatureService: BoostedCreatureService) {}

  @Get()
  @ApiOperation({ summary: 'Get all boosted creatures' })
  @ApiResponse({ status: 200, description: 'Boosted creatures retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async index(): Promise<BoostedCreature[]> {
    return await this.boostedCreatureService.findAll();
  }
}
