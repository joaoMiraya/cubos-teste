import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Movie } from "./Movie";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100, nullable: false })
    name!: string;

    @Column({length: 100, nullable: false })
    url!: string;

    @Column({length: 100, nullable: false })
    alt_text!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => Movie, (movie) => movie.images, { onDelete: "CASCADE" })
    movie!: Movie;
}