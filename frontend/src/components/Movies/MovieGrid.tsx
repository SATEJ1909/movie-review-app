import React from 'react';
import type { Movie } from '../../types';
import MovieCard from './MovieCard';
import LoadingSpinner from '../UI/LoadingSpinner';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  showWatchlistButton?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  isLoading = false, 
  showWatchlistButton = true 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          showWatchlistButton={showWatchlistButton}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
