/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
  IsNumber,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Card } from '../../pagseguro-integration/dto/pagseguro-card.dto';
import { Address } from '../../pagseguro-integration/dto/pagseguro-address.dto';

class Phone {
  @ApiProperty({ example: '55' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '61' })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiProperty({ example: '982638893' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{8,9}$/, {
    message: 'Phone number must be between 10000000 and 999999999',
  })
  number: string;

  @ApiProperty({ example: 'mobile' })
  @IsString()
  @IsNotEmpty()
  type: string;
}

class Customer {
  @ApiProperty({ example: 'Felipe S M Souza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'fmarques899@gmail.com' })
  @IsEmail()
  @Length(5, 60)
  email: string;

  @ApiProperty({ example: '04718287189' })
  @IsString()
  @IsNotEmpty()
  tax_id: string;

  @ApiProperty({ type: [Phone] })
  @ValidateNested({ each: true })
  @Type(() => Phone)
  phones: Phone[];
}

export class GenerateOrderDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  player_id: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiProperty({ type: Customer })
  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @ApiProperty({ type: Address })
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty({ type: Card })
  @ValidateNested()
  @IsOptional()
  @Type(() => Card)
  card?: Card;
}
