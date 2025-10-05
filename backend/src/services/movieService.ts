import { UpdateResult } from "typeorm";
import { CreateMovieDTO } from "../DTOs/movieDTO";
import { Movie } from "../entities/Movie";
import { IMovieRepository } from "../interfaces/IMovieRepository";
import { MovieRepository } from "../repositories/movieRepository";
import { ListMoviesParams, PaginatedResponse } from "../@types/custom";

export class MovieService {
  private movieRepository: IMovieRepository;

  constructor(movieRepository?: IMovieRepository) {
    this.movieRepository = movieRepository || new MovieRepository();
  }

  async getAll(params: ListMoviesParams): Promise<PaginatedResponse<Movie>> {
    const result = await this.movieRepository.list(params);

    if (!result.data || result.data.length === 0) {
      return {
        data: [],
        pagination: {
          total: 0,
          page: params.page,
          limit: params.limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        }
      };
    }

    return result;
  }

  getById = async (id: number): Promise<Movie> => {
    const movie = await this.movieRepository.getById(id);
    if (!movie) {
      return Movie.createWithError('Movie not found');
    }
    return movie;
  }

  async createMovie(data: CreateMovieDTO): Promise<Movie> {

    const movie = await this.movieRepository.create(data);
    if (movie.hasErrors()) {
      return movie;
    }

    await this.movieRepository.save(movie);
    return movie;
  }

  async updateMovie(id:number, data: CreateMovieDTO): Promise<UpdateResult | Movie> {

     const movie = await this.movieRepository.update(id, data);

    if (!movie) {
      return Movie.createWithError('Movie not found');
    }
    
    return movie;
  }
    
    
  async delete(id: number): Promise<void> {
    try {
        await this.movieRepository.delete(id);
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
  }
}