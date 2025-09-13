import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import MovieGrid from '../components/Movies/MovieGrid';
import MovieFilters from '../components/Movies/MovieFilters';
import ErrorMessage from '../components/UI/ErrorMessage';

const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    movies, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    searchFilters,
    fetchMovies, 
    setFilters,
    clearError 
  } = useMovie();

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = {
      search: searchParams.get('search') || undefined,
      genre: searchParams.get('genre') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    };
    
    setFilters(initialFilters);
    fetchMovies(1);
  }, []);

  // Update URL when filters change
  const handleFilterChange = (newFilters: { genre?: string; year?: number; search?: string }) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.genre) params.set('genre', newFilters.genre);
    if (newFilters.year) params.set('year', newFilters.year.toString());
    
    setSearchParams(params);
    
    // Fetch movies with new filters
    fetchMovies(1);
  };

  const handlePageChange = (page: number) => {
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg border ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Movies</h1>
          <p className="text-gray-600">
            Discover and explore our collection of movies
          </p>
        </div>

        {error && (
          <ErrorMessage message={error} onClose={clearError} className="mb-6" />
        )}

        <MovieFilters
          onFilterChange={handleFilterChange}
          currentFilters={searchFilters}
        />

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `Showing ${movies.length} movies`}
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>

        <MovieGrid movies={movies} isLoading={isLoading} />

        {renderPagination()}
      </div>
    </div>
  );
};

export default MoviesPage;

