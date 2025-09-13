import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Heart } from 'lucide-react';
import type { Movie } from '../../types';
import StarRating from '../UI/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useMovie } from '../../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  showWatchlistButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showWatchlistButton = true }) => {
  const { isAuthenticated } = useAuth();
  const { addToWatchlist, removeFromWatchlist, watchlist } = useMovie();

  const isInWatchlist = watchlist.some(item => item.movieId._id === movie._id);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart button
    if (isInWatchlist) {
      await removeFromWatchlist(movie._id);
    } else {
      await addToWatchlist(movie._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/movie/${movie._id}`} className="block">
        <div className="relative">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          
          {isAuthenticated && showWatchlistButton && (
            <button
              onClick={handleWatchlistToggle}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isInWatchlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{movie.releaseYear}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{movie.director}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StarRating rating={movie.averageRating} readonly size="sm" />
              <span className="text-sm text-gray-600">
                ({movie.averageRating.toFixed(1)})
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {genre}
                </span>
              ))}
              {movie.genre.length > 2 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{movie.genre.length - 2}
                </span>
              )}
            </div>
          </div>

          {movie.synopsis && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-3">
              {movie.synopsis}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
