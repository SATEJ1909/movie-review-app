import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import MovieGrid from '../components/Movies/MovieGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const WatchlistPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { watchlist, fetchWatchlist, removeFromWatchlist, error, clearError } = useMovie();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadWatchlist = async () => {
        setIsLoading(true);
        try {
          await fetchWatchlist(user._id);
        } catch (err) {
          console.error('Error loading watchlist:', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadWatchlist();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your watchlist.</p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <ErrorMessage message={error} onClose={clearError} className="mb-6" />
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
          </div>
          <p className="text-gray-600">
            Keep track of movies you want to watch later
          </p>
        </div>

        {/* Watchlist Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {watchlist.length}
              </div>
              <div className="text-gray-600">Movies in Watchlist</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {watchlist.filter(item => item.movieId.averageRating >= 4).length}
              </div>
              <div className="text-gray-600">Highly Rated (4+ stars)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(watchlist.flatMap(item => item.movieId.genre)).size}
              </div>
              <div className="text-gray-600">Different Genres</div>
            </div>
          </div>
        </div>

        {/* Watchlist Content */}
        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : watchlist.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} in your watchlist
              </p>
              <button
                onClick={() => {
                  // Option to clear all from watchlist
                  if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
                    watchlist.forEach(item => {
                      removeFromWatchlist(item.movieId._id);
                    });
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <MovieGrid
              movies={watchlist.map(item => item.movieId)}
              showWatchlistButton={true}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Watchlist is Empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your watchlist by adding movies you want to watch later. 
              Click the heart icon on any movie to add it to your watchlist.
            </p>
            <a
              href="/movies"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Heart className="h-5 w-5 mr-2" />
              Browse Movies
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;

