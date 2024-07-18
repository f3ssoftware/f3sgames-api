import { Test, TestingModule } from '@nestjs/testing';
import { RashidModule } from './rashid.module';
import { RashidController } from './rashid.controller';
import { RashidLocationService } from './rashid.service';

describe('RashidModule', () => {
  let rashidController: RashidController;
  let rashidLocationService: RashidLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RashidModule],
    }).compile();

    rashidController = module.get<RashidController>(RashidController);
    rashidLocationService = module.get<RashidLocationService>(RashidLocationService);
  });

  it('should be defined', () => {
    expect(rashidController).toBeDefined();
    expect(rashidLocationService).toBeDefined();
  });
});
