import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account], 'gameConnection')],
  exports: [TypeOrmModule],
})
export class AccountModule {}