import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ArrayNotEmpty, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Address } from './pagseguro-address.dto';
import { Phone } from './pagseguro-phone.dto';
import { Card } from './pagseguro-card.dto'; 

class Amount {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsString()
  currency: string;
}

class PaymentMethod {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  installments: number;

  @ApiProperty()
  @IsNotEmpty()
  capture: boolean;

  @ApiProperty()
  @IsString()
  soft_descriptor: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Card)
  card: Card;
}

class SubMerchant {
  @ApiProperty()
  @IsString()
  reference_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  tax_id: string;

  @ApiProperty()
  @IsString()
  mcc: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Phone)
  phones: Phone[];
}

export class Charge {
  @ApiProperty()
  @IsString()
  reference_id: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Amount)
  amount: Amount;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  notification_urls: string[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => SubMerchant)
  sub_merchant?: SubMerchant;
}
