import {
    IsEmail,
    IsNotEmpty,
    IsString
} from 'class-validator';
import { Account } from '../account.entity';

export class UpdateAccountDto extends Account {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}