import {
    IsEmail,
    IsNotEmpty,
    IsString
} from 'class-validator';
import { Account } from '../account.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto extends Account {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}