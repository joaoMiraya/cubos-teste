import { useContext } from 'react';
import { MovieContext } from '../context/movieContext';

export function useMovies() {
  const context = useContext(MovieContext);
  
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  
  return context;
}