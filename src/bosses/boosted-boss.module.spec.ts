import { Test, TestingModule } from '@nestjs/testing';
import { BoostedBossModule } from './boosted-boss.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoostedBoss } from './boosted-boss.entity';
import { BoostedBossService } from './boosted-boss.service';
import { BoostedBossController } from './boosted-boss.controller';

describe('BoostedBossModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        BoostedBossModule,
        TypeOrmModule.forFeature([BoostedBoss], 'gameConnection'),
      ],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });
});
