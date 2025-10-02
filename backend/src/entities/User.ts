import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "../constants/userRole";
import { Movie } from "./Movie";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100, nullable: false })
    name!: string;

    @Column({ unique: true, length: 100, nullable: false })
    email!: string;

    @Column({ length: 100, nullable: false })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GHOST,
    })
    role!: UserRole;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @OneToMany(() => Movie, (movie) => movie.user)
    movies!: Movie[];
}
