import { LanguagesEnum } from "../constants/languageEnum";
import { User } from "../entities/User";

export interface CreateMovieDTO {
    title: string;
    original_title: string;
    subtitle: string;
    director: string;
    synopsis: string;
    duration: number;
    age_rating: number;
    rating: number;
    genres: string;
    release_date: Date;
    language: LanguagesEnum;
    revenue: string;
    budget: string;
    user: User;
    posterUrl?: string;
    backgroundUrl?: string;
    trailerUrl?: string;
}
