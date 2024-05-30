import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, ValidateNested } from 'class-validator';
import { Phone } from './pagseguro-phone.dto';

export class Customer {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  tax_id: string;

  @ApiProperty({ type: [Phone] })
  @ValidateNested({ each: true })
  @Type(() => Phone)
  phones: Phone[];
}
