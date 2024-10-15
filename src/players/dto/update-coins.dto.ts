/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCoinsDto {
  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'The number of coins must be at least 1' })
  coins: number;
}
