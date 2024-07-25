import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { NewsCategoryEnum } from '../enum/news-category.enum';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEnum(NewsCategoryEnum)
  @IsNotEmpty()
  category: NewsCategoryEnum;

  @IsString()
  @IsNotEmpty()
  article_text: string;

  @IsString()
  @IsOptional()
  article_image: string;

  @IsBoolean()
  @IsOptional()
  enabled: boolean;
}
