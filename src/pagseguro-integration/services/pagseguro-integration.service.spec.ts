import { Test, TestingModule } from '@nestjs/testing';
import { PagseguroIntegrationService } from './pagseguro-integration.service';

describe('PagseguroIntegrationService', () => {
  let service: PagseguroIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagseguroIntegrationService],
    }).compile();

    service = module.get<PagseguroIntegrationService>(
      PagseguroIntegrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
