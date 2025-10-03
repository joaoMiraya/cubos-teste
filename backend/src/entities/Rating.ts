import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Movie } from "./Movie";

@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", nullable: false })
    rating!: number;

    @ManyToOne(() => Movie, (movie) => movie.ratings, { onDelete: "CASCADE" })
    movie!: Movie;
}