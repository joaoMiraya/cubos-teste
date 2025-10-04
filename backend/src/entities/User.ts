import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, UpdateDateColumn } from "typeorm";
import { Movie } from "./Movie";
import * as argon2 from "argon2";
import { NotifiableEntity } from "../shared/notification/notifiableEntity";
import { validateEmail } from '../shared/validators/index';

@Entity("users")
export class User extends NotifiableEntity {
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

    @Column({ default: true })
    is_active!: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @OneToMany(() => Movie, (movie) => movie.user)
    movies!: Movie[];

    validate(): void {
        if (!this.name || this.name.trim().length === 0) {
            this.addError('Name is required', 'name');
        }

        if (this.name && this.name.length < 3) {
            this.addError('Name must have at least 3 characters', 'name');
        }

        if (!this.email || this.email.trim().length === 0) {
            this.addError('Email is required', 'email');
        }

        if (this.email && !validateEmail(this.email)) {
            this.addError('Email format is invalid', 'email');
        }

        if (!this.password || this.password.length === 0) {
            this.addError('Password is required', 'password');
        }

        if (this.password && this.password.length < 6) {
            this.addError('Password must have at least 6 characters', 'password');
        }
    }

    static createWithError(message: string, context?: string): User {
        const user = new User();
        user.addError(message, context);
        return user;
    }

    async validatePassword(password: string): Promise<boolean> {
        return argon2.verify(this.password, password);
    }
}
