import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousesController } from './house.controller';
import { HousesService } from './house.service';
import { House } from './house.entity';

@Module({
  imports: [TypeOrmModule.forFeature([House], 'gameConnection')],
  controllers: [HousesController],
  providers: [HousesService],
})
export class HousesModule {}