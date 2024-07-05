  import { ApiProperty } from '@nestjs/swagger';
  import { Type } from 'class-transformer';
  import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

  class Holder {
    @ApiProperty({ example: 'Benedicto De Amorim' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '12345678900' })
    @IsString()
    @IsNotEmpty()
    tax_id: string;
  }

  export class Card {
    @ApiProperty({ example: '1234567890123456' })
    @IsString()
    @IsNotEmpty()
    number: string;

    @ApiProperty({ example: '12' })
    @IsString()
    @IsNotEmpty()
    exp_month: string;

    @ApiProperty({ example: '2030' })
    @IsString()
    @IsNotEmpty()
    exp_year: string;

    @ApiProperty({ example: '123' })
    @IsString()
    @IsNotEmpty()
    security_code: string;

    @ApiProperty({ type: Holder })
    @ValidateNested()
    @Type(() => Holder)
    holder: Holder;
  }
