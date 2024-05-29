import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get a greeting message' })
  @ApiResponse({ status: 200, description: 'Greeting message retrieved successfully.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
