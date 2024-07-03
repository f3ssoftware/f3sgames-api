import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { Address } from './pagseguro-address.dto';

export class Shipping {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;
}