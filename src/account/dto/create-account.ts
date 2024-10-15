import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Country } from '../../Shared/countries.enum';
import { CreatePlayerDto } from '../../players/dto/create-player.dto';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'User password (must contain upper and lowercase letters, numbers, and special characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'Account name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Country of the user',
    enum: Country,
    example: 'br', 
  })
  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;

  @ApiProperty({
    type: CreatePlayerDto,
    example: {
      name: 'MyCharacter',
      vocation: 1, 
      sex: 0, 
      town_id: 1,
      conditions: '',
    },
  })
  @ValidateNested() // Ensures the nested object is validated
  @Type(() => CreatePlayerDto) // Necessary for class-transformer to properly instantiate the nested DTO
  player: CreatePlayerDto;
}
