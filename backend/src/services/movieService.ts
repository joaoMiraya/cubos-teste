import { CreateMovieDTO } from "../DTOs/movieDTO";
import { Movie } from "../entities/Movie";
import { IMovieRepository } from "../interfaces/IMovieRepository";
import { MovieRepository } from "../repositories/movieRepository";
import { ListMoviesParams, PaginatedResponse } from "../@types/custom";
import { File } from '../entities/File';
import { FileEnum } from "../constants/fileEnum";

interface UploadedFiles {
  posterUrl?: string;
  posterKey?: string;
  backdropUrl?: string;
  backdropKey?: string;
  trailerUrl?: string;
  trailerKey?: string;
}
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

  async updateMovie(
    id: number, 
    data: Partial<CreateMovieDTO>,
    uploadedFiles?: UploadedFiles
  ): Promise<Movie> {
    const movie = await this.movieRepository.getById(id);
    
    if (!movie) {
      return Movie.createWithError('Movie not found');
    }

    Object.assign(movie, data);

    if (uploadedFiles) {
      if (uploadedFiles.posterUrl && uploadedFiles.posterKey) {
        const posterFile = movie.files.find((f: File) => f.type === FileEnum.POSTER);
        if (posterFile) {
          posterFile.url = uploadedFiles.posterUrl;
          posterFile.key = uploadedFiles.posterKey;
          posterFile.name = `poster_${Date.now()}`;
        } else {
          const newPoster = new File();
          newPoster.name = `poster_${Date.now()}`;
          newPoster.url = uploadedFiles.posterUrl;
          newPoster.key = uploadedFiles.posterKey;
          newPoster.type = FileEnum.POSTER;
          newPoster.alt_text = `${movie.title} poster`;
          newPoster.movie = movie;
          movie.files.push(newPoster);
        }
      }

      if (uploadedFiles.backdropUrl && uploadedFiles.backdropKey) {
        const backgroundFile = movie.files.find((f: File) => f.type === FileEnum.BACKGROUND);
        if (backgroundFile) {
          backgroundFile.url = uploadedFiles.backdropUrl;
          backgroundFile.key = uploadedFiles.backdropKey;
          backgroundFile.name = `background_${Date.now()}`;
        } else {
          const newBackground = new File();
          newBackground.name = `background_${Date.now()}`;
          newBackground.url = uploadedFiles.backdropUrl;
          newBackground.key = uploadedFiles.backdropKey;
          newBackground.type = FileEnum.BACKGROUND;
          newBackground.alt_text = `${movie.title} background`;
          newBackground.movie = movie;
          movie.files.push(newBackground);
        }
      }

      if (uploadedFiles.trailerUrl && uploadedFiles.trailerKey) {
        const trailerFile = movie.files.find((f: File) => f.type === FileEnum.TRAILER);
        if (trailerFile) {
          trailerFile.url = uploadedFiles.trailerUrl;
          trailerFile.key = uploadedFiles.trailerKey;
          trailerFile.name = `trailer_${Date.now()}`;
        } else {
          const newTrailer = new File();
          newTrailer.name = `trailer_${Date.now()}`;
          newTrailer.url = uploadedFiles.trailerUrl;
          newTrailer.key = uploadedFiles.trailerKey;
          newTrailer.type = FileEnum.TRAILER;
          newTrailer.alt_text = `${movie.title} trailer`;
          newTrailer.movie = movie;
          movie.files.push(newTrailer);
        }
      }
    }

    const updatedMovie = await this.movieRepository.save(movie);

    return updatedMovie;
  }
    
  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.movieRepository.delete(id);
      
      if (result.affected === 0) {
        throw new Error('Movie not found or already deleted');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }
}