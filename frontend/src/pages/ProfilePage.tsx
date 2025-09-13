import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, Edit3, Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import MovieGrid from '../components/Movies/MovieGrid';
import ReviewList from '../components/Reviews/ReviewList';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { watchlist, reviews, fetchWatchlist, error, clearError } = useMovie();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'reviews'>('watchlist');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await fetchWatchlist(user._id);
        } catch (err) {
          console.error('Error loading profile data:', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filter reviews for current user (if we had user reviews)
  const userReviews = reviews.filter(review => review.userId._id === user._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <ErrorMessage message={error} onClose={clearError} className="mb-6" />
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.username}
                  className="h-24 w-24 rounded-full border-4 border-white bg-gray-300"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Edit3 className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {watchlist.length}
                </div>
                <div className="text-gray-600">Movies in Watchlist</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {userReviews.length}
                </div>
                <div className="text-gray-600">Reviews Written</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {user.role === 'admin' ? 'Admin' : 'Member'}
                </div>
                <div className="text-gray-600">Account Type</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'watchlist'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Watchlist ({watchlist.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>My Reviews ({userReviews.length})</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'watchlist' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Watchlist</h2>
            </div>

            {isLoading ? (
              <LoadingSpinner size="lg" className="py-12" />
            ) : watchlist.length > 0 ? (
              <MovieGrid
                movies={watchlist.map(item => item.movieId)}
                showWatchlistButton={true}
              />
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Watchlist is Empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Start building your watchlist by adding movies you want to watch later.
                </p>
                <a
                  href="/movies"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Movies
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Reviews</h2>
            </div>

            {userReviews.length > 0 ? (
              <ReviewList reviews={userReviews} />
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Share your thoughts by writing reviews for movies you've watched.
                </p>
                <a
                  href="/movies"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find Movies to Review
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

