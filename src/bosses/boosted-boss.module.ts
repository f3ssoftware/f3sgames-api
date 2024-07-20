import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoostedBossService } from './boosted-boss.service';
import { BoostedBossController } from './boosted-boss.controller';
import { BoostedBoss } from './boosted-boss.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoostedBoss], 'gameConnection')],
  providers: [BoostedBossService],
  controllers: [BoostedBossController],
})
export class BoostedBossModule {}
