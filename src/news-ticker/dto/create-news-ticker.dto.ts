import { ApiProperty } from "@nestjs/swagger";
import { NewsTicker } from "../entities/news-ticker.entity";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNewsTickerDto extends NewsTicker {

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
