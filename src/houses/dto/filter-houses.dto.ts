/* istanbul ignore file */  

/* This first comment is needed to make coverage test from jest ignore the file that has this commentary */

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';
import { Order } from '../enums/order.enum';

export class FilterHousesDto {
  @IsString()
  @IsNotEmpty()
  town: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsEnum(Order)
  @IsNotEmpty()
  order: Order;
}
