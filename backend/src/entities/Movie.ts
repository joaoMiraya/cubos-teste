import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Image } from "./Image";
import { User } from "./User";
import { Category } from "./Category";
import { Rating } from "./Rating";
import { LanguagesEnum } from "../constants/languageEnum";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100, nullable: false })
    title!: string;

    @Column({ length: 300, nullable: false })
    description!: string;

    @Column({ type: "int", nullable: false })
    duration!: number;

    @Column({type: "date", nullable: false })
    release_date!: Date;

    @Column({
        type: "enum",
        enum: LanguagesEnum,
        nullable: false
    })
    language!: LanguagesEnum;

    @Column({type: "decimal", precision: 15, scale: 2, nullable: false })
    revenue!: string;

    @Column({type: "decimal", precision: 15, scale: 2, nullable: false })
    budget!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @OneToMany(() => Image, (image) => image.movie)
    images!: Image[];

    @ManyToOne(() => User, (user) => user.movies, { eager: true})
    user!: User;

    @ManyToMany(() => Category, (category) => category.movies)
    @JoinTable()
    categories!: Category[];

    @OneToMany(() => Rating, (rating) => rating.movie)
    ratings!: Rating[];
}
