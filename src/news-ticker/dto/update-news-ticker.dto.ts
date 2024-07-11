import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNewsTickerDto } from './create-news-ticker.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNewsTickerDto extends PartialType(CreateNewsTickerDto) {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}
