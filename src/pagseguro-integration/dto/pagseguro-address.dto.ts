import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Address {
  @ApiProperty({ example: 'CCSW 300B Bloco 4' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '219' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Edificio Diamond' })
  @IsString()
  complement: string;

  @ApiProperty({ example: 'BRASILIA' })
  @IsString()
  @IsNotEmpty()
  locality: string;

  @ApiProperty({ example: 'BRASILIA' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'DF' })
  @IsString()
  @IsNotEmpty()
  region_code: string;

  @ApiProperty({ example: 'BRA' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '70673083' })
  @IsString()
  @IsNotEmpty()
  postal_code: string;
}
