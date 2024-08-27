import { IsInt, IsNumberString, IsString, Matches, Min } from 'class-validator';
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
    example: '23/08/2024 15:30',
    description: 'The end time of the auction in dd/mm/yyyy hh:mm format',
    type: String
  })
  @IsString()
  @Matches(
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/,
    { message: 'endDate must be in the format dd/mm/yyyy hh:mm' }
  )
  endDate: string;
}
