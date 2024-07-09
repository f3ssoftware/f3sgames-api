import { PartialType } from '@nestjs/swagger';
import { CreateNewsTickerDto } from './create-news-ticker.dto';

export class UpdateNewsTickerDto extends PartialType(CreateNewsTickerDto) {}
