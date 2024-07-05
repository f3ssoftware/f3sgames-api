import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  vocation: number;

  @IsNotEmpty()
  @IsNumber()
  sex: number;

  @IsNotEmpty()
  @IsNumber()
  town_id: number;
}
