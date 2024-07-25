import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsPost } from './news-post.entity';
import { NewsService } from './news-post.service';
import { NewsPostController } from './news-post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NewsPost], 'paymentConnection')],
  providers: [NewsService],
  controllers: [NewsPostController],
})
export class NewsPostModule {}
