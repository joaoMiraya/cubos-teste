import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Movie } from "./Movie";
import { FileEnum } from "../constants/fileEnum";
import { NotifiableEntity } from "../shared/notification/notifiableEntity";

@Entity("files")
export class File extends NotifiableEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100, nullable: false })
    name!: string;
    
    @Column({type: "text", nullable: false })
    url!: string;

    @Column({
        type: "enum",
        enum: FileEnum,
        nullable: false
    })
    type!: FileEnum;

    @Column({length: 100, nullable: false })
    key!: string;

    @Column({length: 100, nullable: false })
    alt_text!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => Movie, (movie) => movie.files, { onDelete: "CASCADE" })
    movie!: Movie;

    validate(): void {
        if (!this.name || this.name.trim().length === 0) {
            this.addError('File name is required', 'name');
        } else if (this.name.length < 3) {
            this.addError('File name must have at least 3 characters', 'name');
        }

        if (!this.url || this.url.trim().length === 0) {
            this.addError('File URL is required', 'url');
        } else if (!this.url.startsWith('http')) {
            this.addError('File URL must be a valid link', 'url');
        }

        if (!this.type) {
            this.addError('File type is required', 'type');
        } else if (!Object.values(FileEnum).includes(this.type)) {
            this.addError('Invalid file type', 'type');
        }

        if (!this.key || this.key.trim().length === 0) {
            this.addError('File key is required', 'key');
        }

        if (!this.alt_text || this.alt_text.trim().length === 0) {
            this.addError('Alt text is required', 'alt_text');
        } else if (this.alt_text.length < 3) {
            this.addError('Alt text must have at least 3 characters', 'alt_text');
        }

        if (!this.movie) {
            this.addError('File must be associated with a movie', 'movie');
        }
    }

    static createWithError(message: string, context?: string): File {
        const file = new File();
        file.addError(message, context);
        return file;
    }
}