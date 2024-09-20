/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Country } from '../../Shared/countries.enum'; 

export class CreateAccountDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Country of the user',
    enum: Country,
  })
  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;

  id?: number;
  premDays?: number;
  premDaysPurchased?: number;
  coins?: number;
  coinsTransferable?: number;
  tournamentCoins?: number;
  creation?: number;
  recruiter?: number;
}
