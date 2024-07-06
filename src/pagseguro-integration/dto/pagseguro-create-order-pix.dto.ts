import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested, IsNumber, IsDateString, IsArray, ArrayNotEmpty, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Customer } from './pagseguro-customer.dto';
import { Item } from './pagseguro-item.dto';
import { Shipping } from './pagseguro-shipping.dto';

class Amount {
  @ApiProperty({ description: 'Value of the amount in cents' })
  @IsNumber()
  value: number;
}

class QRCode {
  @ApiProperty({ description: 'Amount details for the QR code' })
  @ValidateNested()
  @Type(() => Amount)
  amount!: Amount;

  @ApiPropertyOptional({ description: 'Expiration date of the QR code' })
  @IsDateString()
  @IsOptional()
  expiration_date?: string;
}

export class PagseguroCreateOrderPixDto {
  @ApiProperty({
    description: 'List of QR codes for Pix payment',
    type: [QRCode],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QRCode)
  qr_codes!: QRCode[];

  @ApiProperty({
    description: 'List of items in the order',
    type: [Item],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items!: Item[];

  @ApiProperty({ description: 'Customer details' })
  @ValidateNested()
  @Type(() => Customer)
  customer!: Customer;

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

  @ApiProperty({ example: 'Reference ID' })
  @IsString()
  @IsNotEmpty()
  reference_id!: string;
}