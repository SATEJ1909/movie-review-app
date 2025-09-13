import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Heart, 
  ArrowLeft, 
  Star,
  Play
} from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/UI/StarRating';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewList from '../components/Reviews/ReviewList';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { 
    currentMovie, 
    reviews, 
    watchlist,
    isLoading, 
    error, 
    fetchMovieById, 
    fetchMovieReviews,
    addToWatchlist,
    removeFromWatchlist,
    clearError,
    clearCurrentMovie 
  } = useMovie();

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  useEffect(() => {
    if (id) {
      fetchMovieById(id);
      fetchMovieReviews(id);
    }

    return () => {
      clearCurrentMovie();
    };
  }, [id]);

  const isInWatchlist = currentMovie && watchlist.some(item => item.movieId._id === currentMovie._id);

  const handleWatchlistToggle = async () => {
    if (!currentMovie) return;
    
    if (isInWatchlist) {
      await removeFromWatchlist(currentMovie._id);
    } else {
      await addToWatchlist(currentMovie._id);
    }
  };

  if (isLoading && !currentMovie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} onClose={clearError} />
          <div className="mt-6">
            <Link
              to="/movies"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Movie not found</p>
            <Link
              to="/movies"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/movies"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movies
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              {currentMovie.posterUrl ? (
                <img
                  src={currentMovie.posterUrl}
                  alt={currentMovie.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-sm mx-auto h-96 bg-gray-600 rounded-lg shadow-2xl flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{currentMovie.title}</h1>
              
              {/* Rating and Actions */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <StarRating rating={currentMovie.averageRating} readonly />
                  <span className="text-lg font-semibold">
                    {currentMovie.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-300">
                    ({reviews.length} reviews)
                  </span>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={handleWatchlistToggle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isInWatchlist
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                    <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                  </button>
                )}
              </div>

              {/* Movie Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{currentMovie.releaseYear}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="h-4 w-4" />
                  <span>{currentMovie.director}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentMovie.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              {currentMovie.synopsis && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {currentMovie.synopsis}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Cast */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentMovie.cast.map((actor, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
                    <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <p className="font-medium text-gray-900">{actor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Movie Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Movie Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {currentMovie.averageRating.toFixed(1)}
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {reviews.length}
                  </div>
                  <div className="text-gray-600">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {currentMovie.releaseYear}
                  </div>
                  <div className="text-gray-600">Release Year</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <ReviewForm movieId={currentMovie._id} />
            <ReviewList reviews={reviews} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;

