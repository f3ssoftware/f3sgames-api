import { Controller, Get } from '@nestjs/common';
import { BoostedBossService } from './boosted-boss.service';
import { BoostedBoss } from './boosted-boss.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('boosted-boss')
@Controller('boosted-boss')
export class BoostedBossController {
  constructor(private readonly boostedBossService: BoostedBossService) {}

  @Get()
  @ApiOperation({ summary: 'Get all boosted bosses' })
  @ApiResponse({ status: 200, description: 'Boosted bosses retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No boosted bosses found.' })
  async findAll(): Promise<BoostedBoss[]> {
    return await this.boostedBossService.findAll();
  }
}
