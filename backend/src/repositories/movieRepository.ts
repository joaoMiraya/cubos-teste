import { Between, DeleteResult, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Movie } from '../entities/Movie';
import { AppDataSource } from '../data-source';
import { IMovieRepository } from '../interfaces/IMovieRepository';
import { ListMoviesParams, PaginatedResponse } from '../@types/custom';

export class MovieRepository implements IMovieRepository {
    private repository: Repository<Movie>;

    constructor() {
        this.repository = AppDataSource.getRepository(Movie);
    }

    async list(params: ListMoviesParams): Promise<PaginatedResponse<Movie>> {
        const { ownerId, duration, initial_date, final_date, genre, search, page, limit } = params;

        const where: FindOptionsWhere<Movie> = {
            user: { id: ownerId }
        };

        if (duration !== undefined) {
            where.duration = duration;
        }

        if (genre) {
            where.genres = genre;
        }

        if (search) {
             where.title = ILike(`%${search.trim()}%`);
        }

        if (initial_date && final_date) {
            where.release_date = Between(initial_date, final_date);
        } else if (initial_date) {
            where.release_date = MoreThanOrEqual(initial_date);
        } else if (final_date) {
            where.release_date = LessThanOrEqual(final_date);
        }

        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            where,
            skip,
            take: limit,
            order: {
            release_date: 'DESC'
            }
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            data,
            pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNext,
            hasPrev
            }
        };
    }
    async getById(id: number): Promise<Movie | null> {
        return await this.repository.findOne({
            where: { id },
        });
    }

    async create(userData: Partial<Movie>): Promise<Movie> {
        return this.repository.create(userData);
    }

    async update(id: number, movieData: Partial<Movie>): Promise<UpdateResult> {
        const cleanData = Object.fromEntries(
            Object.entries(movieData).filter(([_, value]) => value !== undefined)
        );

        return await this.repository.update({ id }, cleanData);
    }


    async delete(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    async save(user: Movie): Promise<Movie> {
        return await this.repository.save(user);
    }
}