import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PagseguroCreateOrderDto } from './pagseguro-create-order.dto';
import {
  ValidateNested,
  IsNumber,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

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
export class PagseguroCreateOrderPixDto extends PagseguroCreateOrderDto {
  @ApiProperty({
    description: 'List of QR codes for Pix payment',
    type: [QRCode],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QRCode)
  qr_codes!: QRCode[];
}
