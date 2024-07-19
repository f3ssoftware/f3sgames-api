import { Test, TestingModule } from '@nestjs/testing';
import { NewsTickerModule } from './news-ticker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTicker } from './entities/news-ticker.entity';
import { NewsTickerService } from './news-ticker.service';
import { NewsTickerController } from './news-ticker.controller';

describe('NewsTickerModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        NewsTickerModule,
        TypeOrmModule.forFeature([NewsTicker], 'paymentConnection'),
      ],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });
});
