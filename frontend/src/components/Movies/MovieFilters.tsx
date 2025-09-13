import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface MovieFiltersProps {
  onFilterChange: (filters: { genre?: string; year?: number; search?: string }) => void;
  currentFilters: { genre?: string; year?: number; search?: string };
}

const MovieFilters: React.FC<MovieFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = useState({
    search: currentFilters.search || '',
    genre: currentFilters.genre || '',
    year: currentFilters.year ? currentFilters.year.toString() : '',
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Common movie genres
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance',
    'Science Fiction', 'Thriller', 'War', 'Western'
  ];

  // Generate year options (current year back to 1900)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  useEffect(() => {
    setLocalFilters({
      search: currentFilters.search || '',
      genre: currentFilters.genre || '',
      year: currentFilters.year ? currentFilters.year.toString() : '',
    });
  }, [currentFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      const newFilters = {
        ...currentFilters,
        search: value || undefined,
      };
      onFilterChange(newFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, genre: value }));
    
    const newFilters = {
      ...currentFilters,
      genre: value || undefined,
    };
    onFilterChange(newFilters);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, year: value }));
    
    const newFilters = {
      ...currentFilters,
      year: value ? parseInt(value) : undefined,
    };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setLocalFilters({ search: '', genre: '', year: '' });
    onFilterChange({});
  };

  const hasActiveFilters = currentFilters.search || currentFilters.genre || currentFilters.year;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search movies..."
            value={localFilters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {[currentFilters.genre, currentFilters.year].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Genre Filter */}
          <div className="min-w-[150px]">
            <select
              value={localFilters.genre}
              onChange={handleGenreChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="min-w-[120px]">
            <select
              value={localFilters.year}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      {isFiltersOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                value={localFilters.genre}
                onChange={handleGenreChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={localFilters.year}
                onChange={handleYearChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieFilters;
