import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';
import { Vocation } from '../enums/vocations.enum';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Vocation)
  vocation: Vocation;

  @IsNotEmpty()
  @IsNumber()
  sex: number;

  @IsNotEmpty()
  @IsNumber()
  town_id: number;
}
