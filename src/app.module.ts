import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { PagseguroIntegrationModule } from './pagseguro-integration/pagseguro-integration.module';

@Module({
  imports: [PagseguroIntegrationModule],
  controllers: [],
  providers: [AppService],
  // imports: [TypeOrmModule.forFeature([Player])],
  // controllers: [AppController, PlayerController],
  // providers: [AppService, PlayerService],
})
export class AppModule {}
