import { Test, TestingModule } from '@nestjs/testing';
import { BoostedCreatureModule } from './boosted-creature.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoostedCreature } from './boosted-creature.entity';
import { BoostedCreatureService } from './boosted-creature.service';
import { BoostedCreatureController } from './boosted-creature.controller';

describe('BoostedCreatureModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        BoostedCreatureModule,
        TypeOrmModule.forFeature([BoostedCreature], 'gameConnection'),
      ],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });
});
