import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'news_ticker' })
export class NewsTicker {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    description: string;
}
