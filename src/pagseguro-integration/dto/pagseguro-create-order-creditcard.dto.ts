import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Customer } from './pagseguro-customer.dto';
import { Item } from './pagseguro-item.dto';
import { Shipping } from './pagseguro-shipping.dto';
import { Charge } from './pagseguro-charge.dto';

export class PagseguroCreateOrderCreditCardDto {
  @ApiProperty()
  @IsString()
  reference_id: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => Shipping)
  shipping: Shipping;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Charge)
  charges: Charge[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  notification_urls: string[];
}
