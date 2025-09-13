import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import MovieGrid from '../components/Movies/MovieGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const HomePage: React.FC = () => {
  const { movies, isLoading, error, fetchMovies, clearError } = useMovie();

  useEffect(() => {
    fetchMovies(1);
  }, []);

  // Get featured movies (top rated) and trending (recent)
  const featuredMovies = movies
    .filter(movie => movie.averageRating > 4)
    .slice(0, 4);
  
  const trendingMovies = movies
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Movies
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Find your next favorite film, read reviews, and share your thoughts with the community
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/movies"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Movies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ErrorMessage message={error} onClose={clearError} />
        </div>
      )}

      {/* Featured Movies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Movies</h2>
            </div>
            <Link
              to="/movies"
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : featuredMovies.length > 0 ? (
            <MovieGrid movies={featuredMovies} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured movies available</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <Link
              to="/movies"
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : trendingMovies.length > 0 ? (
            <MovieGrid movies={trendingMovies} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No trending movies available</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {movies.length}+
              </div>
              <div className="text-xl">Movies Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                1000+
              </div>
              <div className="text-xl">User Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                500+
              </div>
              <div className="text-xl">Active Users</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

