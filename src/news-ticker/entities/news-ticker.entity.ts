import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'news_ticker' })
export class NewsTicker {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    description: string;
}
