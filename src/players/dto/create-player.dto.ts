import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @IsNotEmpty()
  @IsNumber()
  account_id: number;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsNumber()
  vocation: number;

  @IsNotEmpty()
  @IsNumber()
  health: number;

  @IsNotEmpty()
  @IsNumber()
  healthmax: number;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @IsNotEmpty()
  @IsNumber()
  town_id: number;

  @IsOptional()
  @IsString()
  conditions?: string;
}
