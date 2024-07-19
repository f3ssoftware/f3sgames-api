import { Module } from '@nestjs/common';
import { RashidController } from './rashid.controller';
import { RashidLocationService } from './rashid.service';

@Module({
  controllers: [RashidController],
  providers: [RashidLocationService],
})
export class RashidModule {}
