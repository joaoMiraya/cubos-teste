import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, ManyToOne } from "typeorm";
import { File } from "./File";
import { User } from "./User";
import { LanguagesEnum } from "../constants/languageEnum";
import { NotifiableEntity } from "../shared/notification/notifiableEntity";

@Entity("movies")
export class Movie extends NotifiableEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100, nullable: false })
    title!: string;

    @Column({length: 100, nullable: false })
    original_title!: string;

    @Column({length: 100, nullable: false })
    subtitle!: string;

    @Column({length: 100, nullable: false })
    director!: string;

    @Column({type: "text", nullable: false })
    synopsis!: string;

    @Column({ type: "int", nullable: false })
    duration!: number;

    @Column({ type: "int", nullable: false })
    age_rating!: number;

    @Column({length: 100, nullable: false })
    genres!: string;

    @Column({type: "int", nullable: false })
    rating!: number;

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

    @OneToMany(() => File, (file) => file.movie, { eager: true })
    files!: File[];

    @ManyToOne(() => User, (user) => user.movies, { eager: true })
    user!: User;

    validate(): void {
        if (!this.title || this.title.trim().length === 0) {
            this.addError('Title is required', 'title');
        } else if (this.title.length < 3) {
            this.addError('Title must have at least 3 characters', 'title');
        }

        if (!this.original_title || this.original_title.trim().length === 0) {
            this.addError('Original title is required', 'original_title');
        }

        if (!this.subtitle || this.subtitle.trim().length === 0) {
            this.addError('Subtitle is required', 'subtitle');
        }

        if (!this.director || this.director.trim().length === 0) {
            this.addError('Director is required', 'director');
        }

        if (!this.synopsis || this.synopsis.trim().length === 0) {
            this.addError('Synopsis is required', 'synopsis');
        } else if (this.synopsis.length > 500) {
            this.addError('Synopsis must not exceed 500 characters', 'synopsis');
        }

        if (this.duration == null || this.duration <= 0) {
            this.addError('Duration must be a positive number', 'duration');
        }

        if (this.age_rating == null || this.age_rating < 0) {
            this.addError('Age rating must be a non-negative number', 'age_rating');
        }

        if (!this.release_date) {
            this.addError('Release date is required', 'release_date');
        }

        if (!this.language) {
            this.addError('Language is required', 'language');
        }

        if (this.rating == null || this.rating < 0 || this.rating > 10) {
            this.addError('Rating must be between 0 and 10', 'rating');
        }

        if(this.genres == null || this.genres.trim().length === 0) {
            this.addError('At least one genre is required', 'genres');
        }

        if (!this.revenue || isNaN(Number(this.revenue))) {
            this.addError('Revenue must be a valid number', 'revenue');
        }

        if (!this.budget || isNaN(Number(this.budget))) {
            this.addError('Budget must be a valid number', 'budget');
        }

        if (!this.user) {
            this.addError('Movie must have an owner', 'user');
        }
    }

    static createWithError(message: string, context?: string): Movie {
        const movie = new Movie();
        movie.addError(message, context);
        return movie;
    }
}
