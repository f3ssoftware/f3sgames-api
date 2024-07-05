import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested, IsArray, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Phone } from './pagseguro-phone.dto';

export class Customer {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tax_id: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Phone)
  phones: Phone[];
}
