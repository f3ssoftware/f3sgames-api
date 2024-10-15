import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoostedCreature } from './boosted-creature.entity';
import { BoostedCreatureService } from './boosted-creature.service';
import { BoostedCreatureController } from './boosted-creature.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BoostedCreature], 'gameConnection')],
  providers: [BoostedCreatureService],
  controllers: [BoostedCreatureController],
})
export class BoostedCreatureModule {}
