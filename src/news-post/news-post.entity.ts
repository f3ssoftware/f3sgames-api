import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { NewsCategoryEnum } from './enum/news-category.enum';

@Entity()
export class NewsPost {
@PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  body: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: NewsCategoryEnum
  })
  category: NewsCategoryEnum;

  @Column({ length: 300 })
  article_text: string;

  @Column({ length: 100 })
  article_image: string;

  @Column({ default: true })
  enabled: boolean;
}
