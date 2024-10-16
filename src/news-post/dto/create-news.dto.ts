import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';
import { NewsCategoryEnum } from '../enum/news-category.enum'

export class CreateNewsDto {
  @ApiProperty({ example: 'Fixes and Changes' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Detailed description of fixes and changes...' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: NewsCategoryEnum.UPDATE, enum: NewsCategoryEnum })
  @IsEnum(NewsCategoryEnum)
  @IsNotEmpty()
  category: NewsCategoryEnum;

  @ApiProperty({ example: 'Fixes and Changes Summary' })
  @IsString()
  @IsNotEmpty()
  article_text: string;

  @ApiProperty({ example: 'fixes_and_changes.jpg', required: false })
  @IsString()
  article_image?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;
}
