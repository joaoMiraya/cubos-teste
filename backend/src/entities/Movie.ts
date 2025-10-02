import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, ManyToOne } from "typeorm";
import { Image } from "./Image";
import { User } from "./User";

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

    @Column({length: 50, nullable: false })
    language!: string;

    @Column({nullable: false, type: "int"})
    images_id!: number;

    @Column({type: "decimal", precision: 15, scale: 2, nullable: false })
    revenue!: string;

    @Column({type: "decimal", precision: 15, scale: 2, nullable: false })
    budget!: string;

    @Column({ type: "int", nullable: false })
    created_by!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @OneToMany(() => Image, (image) => image.movie, { cascade: true })
    images!: Image[];

    @ManyToOne(() => User, (user) => user.movies, { eager: true})
    user!: User;
}
