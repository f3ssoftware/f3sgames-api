import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Address {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  complement: string;

  @ApiProperty()
  @IsString()
  locality: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  region_code: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  postal_code: string;
}
