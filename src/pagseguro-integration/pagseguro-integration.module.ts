import { Module } from '@nestjs/common';
import { PagseguroIntegrationService } from './services/pagseguro-integration.service';

@Module({
  providers: [PagseguroIntegrationService],
  controllers: [],
})
export class PagseguroIntegrationModule {}
