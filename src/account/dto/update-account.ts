/* istanbul ignore file */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  password?: string;
  premDays?: number;
  premDaysPurchased?: number;
  coins?: number;
  coinsTransferable?: number;
  tournamentCoins?: number;
  creation?: number;
  recruiter?: number;
}
