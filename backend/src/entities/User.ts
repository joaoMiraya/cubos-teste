import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Movie } from "./Movie";
import * as argon2 from "argon2";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100, nullable: false })
    name!: string;

    @Column({ unique: true, length: 100, nullable: false })
    email!: string;

    @Column({ type: "varchar", length: 255, nullable: false, select: false })
    password!: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith("$argon2")) {
            this.password = await argon2.hash(this.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 5,
                parallelism: 1,
            });
        }
    }

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @OneToMany(() => Movie, (movie) => movie.user)
    movies!: Movie[];

    async validatePassword(password: string): Promise<boolean> {
        return argon2.verify(this.password, password);
    }
}
