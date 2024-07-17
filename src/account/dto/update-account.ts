/* istanbul ignore file */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
