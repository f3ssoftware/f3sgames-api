import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, ValidateNested, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Phone } from './pagseguro-phone.dto';

export class Customer {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @Length(5, 60)
  email: string;

  @ApiProperty()
  @IsString()
  tax_id: string;

  @ApiProperty({ type: [Phone] })
  @ValidateNested({ each: true })
  @Type(() => Phone)
  phones: Phone[];
}
