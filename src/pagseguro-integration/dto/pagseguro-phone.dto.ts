import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class Phone {
  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  area: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  @IsString()
  type: string;
}
