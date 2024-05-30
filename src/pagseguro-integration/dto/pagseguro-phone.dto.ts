import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Phone {
  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  type: string;
}
