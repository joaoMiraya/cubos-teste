
export interface CreateMovieType {
  title: string;
  originalTitle: string;
  subtitle: string;
  synopsis: string;
  poster: File | null;
  background: File | null;
  trailer: File | null;
  ageRating: number;
  releaseDate: string;
  duration: number;
  director: string;
  rating: number;
  genres: string;
  language: string;
  budget: number;
  revenue: number;
}
export interface MovieFiles {
  alt_text: string;
  type: string;
  url: string;
}

export interface MovieType {
  id: number;
  userId: number;
  title: string;
  original_title: string;
  subtitle: string;
  synopsis: string;
  rating: number;
  files: MovieFiles[];
  age_rating: number | string;
  release_date: Date | string;
  duration: number | string;
  director: string;
  status?: string;
  genres: string;
  language: string;
  budget: number;
  revenue: number;
  created_at: string;
}
