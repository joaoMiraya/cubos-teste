import { ListMoviesParams, PaginatedResponse } from "../@types/custom";
import { Movie } from "../entities/Movie";

export interface IMovieRepository {
  list(params: ListMoviesParams): Promise<PaginatedResponse<Movie>>;
  getById(id: number): Promise<Movie | null>;
  create(userData: Partial<Movie>): Promise<Movie>;
  update(id: number, userData: Partial<Movie>): Promise<import("typeorm").UpdateResult>;
  delete(id: number): Promise<void>;
  save(user: Movie): Promise<Movie>;
}