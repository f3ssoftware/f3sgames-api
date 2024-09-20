import { IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
    @ApiProperty({
        example: 150,
        description: 'The amount of the bid, which must be equal to or higher than the starting price of the auction.',
        type: Number,
    })
    @IsInt()
    @Min(0)
    amount: number;

}
