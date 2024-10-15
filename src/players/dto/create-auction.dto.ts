import { IsInt, IsString, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({
    example: 100,
    description: 'The starting price for the auction',
    type: Number
  })
  @IsInt()
  @Min(0)
  startingPrice: number;

  @ApiProperty({
    example: '30/08/2024 09:00 UTC',
    description: 'The end time of the auction in UTC (dd/mm/yyyy hh:mm UTC)',
    type: String
  })
  @IsString()
  @Matches(
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} UTC$/,
    { message: 'endDate must be in the format dd/mm/yyyy hh:mm UTC' }
  )
  endDate: string;
}
