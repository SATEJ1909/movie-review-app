import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import type { Review } from '../../types';
import StarRating from '../UI/StarRating';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to share your thoughts about this movie!</p>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Reviews ({reviews.length})
        </h3>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <img
                src={review.userId.profilePicture || '/default-avatar.png'}
                alt={review.userId.username}
                className="h-10 w-10 rounded-full bg-gray-300 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                {/* User Info and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {review.userId.username}
                    </h4>
                    <StarRating rating={review.rating} readonly size="sm" />
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(review.timestamp)}
                  </div>
                </div>

                {/* Review Text */}
                {review.reviewText && (
                  <div className="mt-3">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {review.reviewText}
                    </p>
                  </div>
                )}

                {/* Review Actions (for future features like helpful votes) */}
                <div className="mt-4 flex items-center space-x-4">
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    Helpful
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
