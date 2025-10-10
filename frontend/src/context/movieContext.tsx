/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.service';
import type { CreateMovieType, MovieType } from '../types/movie.types';
import { useAuth } from '../hooks/useAuth';

export interface MovieFilters {
  genre?: string;
  initialDate?: string;
  finalDate?: string;
  period?: number;
  search?: string;
  duration?: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MovieResponse {
  data: MovieType[];
  pagination: PaginationData;
}

export interface UpdateMovieType extends Partial<CreateMovieType> {
  id: number;
}

interface MovieContextType {
  movies: MovieType[] | undefined;
  loading: boolean;
  filters: MovieFilters;
  pagination: PaginationData;
  setFilters: (filters: MovieFilters) => void;
  updateFilters: (filters: Partial<MovieFilters>) => void;
  updateSearch: (search: string) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  create: (data: CreateMovieType) => Promise<{ success: boolean; error?: string }>;
  update: (data: UpdateMovieType) => Promise<{ success: boolean; error?: string }>;
  deleteMovie: (id: number) => Promise<MovieType | null>;
  getById: (id: number) => Promise<MovieType | null>;
  refetch: () => void;
  error: Error | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [filters, setFiltersState] = useState<MovieFilters>({});
  const [page, setPageState] = useState(1);
  const limit = 4;

  const {isAuthenticated} = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['movies', filters, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.initialDate) params.append('initial_date', filters.initialDate);
      if (filters.finalDate) params.append('final_date', filters.finalDate);
      if (filters.period) params.append('period', filters.period.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.duration) params.append('duration', filters.duration.toString());
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/movies?${params.toString()}`);
      
      return {
        data: response.data.data || response.data,
        pagination: response.data.pagination || {
          page,
          limit,
          total: response.data.total || response.data.length,
          totalPages: response.data.totalPages || Math.ceil((response.data.total || response.data.length) / limit),
        },
      } as MovieResponse;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated
  });

  const createMovieMutation = useMutation({
    mutationFn: async (data: CreateMovieType) => {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      formData.append('genres', data.genres);
      formData.append('original_title', data.originalTitle);
      formData.append('synopsis', data.synopsis);
      formData.append('release_date', String(data.releaseDate));
      formData.append('age_rating', String(data.ageRating));
      formData.append('duration', String(data.duration));
      formData.append('director', data.director);
      formData.append('language', data.language);
      formData.append('rating', String(data.rating));
      formData.append('budget', String(data.budget));
      formData.append('revenue', String(data.revenue));

      if (data.poster) formData.append('poster', data.poster);
      if (data.background) formData.append('background', data.background);
      if (data.trailer) formData.append('trailer', data.trailer);

      const response = await api.post('/movies', formData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      setPageState(1);
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: async (data: UpdateMovieType) => {
      const { id, ...movieData } = data;
      const formData = new FormData();

      // Adiciona apenas os campos que foram fornecidos
      if (movieData.title) formData.append('title', movieData.title);
      if (movieData.subtitle) formData.append('subtitle', movieData.subtitle);
      if (movieData.genres) formData.append('genres', movieData.genres);
      if (movieData.originalTitle) formData.append('original_title', movieData.originalTitle);
      if (movieData.synopsis) formData.append('synopsis', movieData.synopsis);
      if (movieData.releaseDate) formData.append('release_date', String(movieData.releaseDate));
      if (movieData.ageRating !== undefined) formData.append('age_rating', String(movieData.ageRating));
      if (movieData.duration !== undefined) formData.append('duration', String(movieData.duration));
      if (movieData.director) formData.append('director', movieData.director);
      if (movieData.language) formData.append('language', movieData.language);
      if (movieData.rating !== undefined) formData.append('rating', String(movieData.rating));
      if (movieData.budget !== undefined) formData.append('budget', String(movieData.budget));
      if (movieData.revenue !== undefined) formData.append('revenue', String(movieData.revenue));

      if (movieData.poster) formData.append('poster', movieData.poster);
      if (movieData.background) formData.append('background', movieData.background);
      if (movieData.trailer) formData.append('trailer', movieData.trailer);

      const response = await api.put(`/movies/${id}`, formData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  const getById = useCallback(async (id: number): Promise<MovieType | null> => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    }
    catch (error) {
      console.error('Get movie by ID error:', error);
      return null;
    }
  }, []);

  const deleteMovie = useCallback(async (id: number): Promise<MovieType | null> => {
    try {
      const response = await api.delete(`/movies/${id}`);
      return response.data;
    }
    catch (error) {
      console.error('Get movie by ID error:', error);
      return null;
    }
  }, []);

  const setFilters = useCallback((newFilters: MovieFilters) => {
    setFiltersState(newFilters);
    setPageState(1);
  }, []);

  const updateFilters = useCallback((partialFilters: Partial<MovieFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partialFilters }));
    setPageState(1);
  }, []);

  const updateSearch = useCallback((search: string) => {
    setFiltersState(prev => ({ ...prev, search }));
    setPageState(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.pagination.totalPages || 1)) {
      setPageState(newPage);
    }
  }, [data?.pagination.totalPages]);

  const nextPage = useCallback(() => {
    if (page < (data?.pagination.totalPages || 1)) {
      setPageState(page + 1);
    }
  }, [page, data?.pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPageState(page - 1);
    }
  }, [page]);

  const create = useCallback(async (
    data: CreateMovieType
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await createMovieMutation.mutateAsync(data);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.errors?.[0]?.message || 'Erro desconhecido';
      console.error('Create movie error:', error);
      return { success: false, error: message };
    }
  }, [createMovieMutation]);

  const update = useCallback(async (
    data: UpdateMovieType
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await updateMovieMutation.mutateAsync(data);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.errors?.[0]?.message || 'Erro ao atualizar filme';
      console.error('Update movie error:', error);
      return { success: false, error: message };
    }
  }, [updateMovieMutation]);

  const value: MovieContextType = {
    movies: data?.data,
    loading: isLoading,
    filters,
    pagination: data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
    setFilters,
    updateFilters,
    updateSearch,
    clearFilters,
    setPage,
    nextPage,
    prevPage,
    create,
    update,
    deleteMovie,
    getById,
    refetch,
    error,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

export { MovieContext };