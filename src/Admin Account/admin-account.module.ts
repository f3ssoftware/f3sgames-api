import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAccount } from './admin-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminAccount], 'websiteConnection'), 
  ],
  exports: [TypeOrmModule],
})
export class AdminAccountModule {}
