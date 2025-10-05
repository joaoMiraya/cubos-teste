export interface MulterFiles {
  poster?: Express.Multer.File[];
  background?: Express.Multer.File[];
  trailer?: Express.Multer.File[];
}

export interface ListMoviesParams {
  ownerId: number;
  duration?: number;
  initial_date?: Date;
  final_date?: Date;
  genre?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}