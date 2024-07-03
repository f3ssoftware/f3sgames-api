import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Customer } from './pagseguro-customer.dto';
import { Item } from './pagseguro-item.dto';
import { Shipping } from './pagseguro-shipping.dto';

export class PagseguroCreateOrderDto {
  @ApiProperty({ description: 'Unique reference identifier for the order' })
  @IsNotEmpty()
  reference_id!: string;

  @ApiProperty({ description: 'Customer details' })
  @ValidateNested()
  @Type(() => Customer)
  customer!: Customer;

  @ApiProperty({ description: 'List of items in the order' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items!: Item[];

  @ApiProperty({ description: 'Shipping details' })
  @ValidateNested()
  @Type(() => Shipping)
  shipping!: Shipping;

  @ApiProperty({
    description: 'URLs to send notifications about order events',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  notification_urls!: string[];
}