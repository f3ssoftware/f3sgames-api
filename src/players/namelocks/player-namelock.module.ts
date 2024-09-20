import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerNamelock } from './player-namelock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerNamelock], 'gameConnection')],
  exports: [TypeOrmModule],
})
export class PlayerNamelockModule {}
  