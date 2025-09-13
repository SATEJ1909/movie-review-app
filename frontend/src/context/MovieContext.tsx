import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Movie, MoviesResponse, Review, WatchlistItem } from '../types';
import { moviesAPI, watchlistAPI } from '../services/api';

interface MovieState {
  movies: Movie[];
  currentMovie: Movie | null;
  reviews: Review[];
  watchlist: WatchlistItem[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  searchFilters: {
    genre?: string;
    year?: number;
    search?: string;
  };
}

type MovieAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MOVIES'; payload: MoviesResponse }
  | { type: 'SET_CURRENT_MOVIE'; payload: Movie }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'SET_WATCHLIST'; payload: WatchlistItem[] }
  | { type: 'ADD_TO_WATCHLIST'; payload: WatchlistItem }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'SET_FILTERS'; payload: { genre?: string; year?: number; search?: string } }
  | { type: 'CLEAR_CURRENT_MOVIE' };

const initialState: MovieState = {
  movies: [],
  currentMovie: null,
  reviews: [],
  watchlist: [],
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  searchFilters: {},
};

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_MOVIES':
      return {
        ...state,
        movies: action.payload.movies,
        totalPages: action.payload.pages,
        currentPage: action.payload.page,
        isLoading: false,
        error: null,
      };
    case 'SET_CURRENT_MOVIE':
      return { ...state, currentMovie: action.payload, isLoading: false, error: null };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    case 'ADD_REVIEW':
      return { ...state, reviews: [action.payload, ...state.reviews] };
    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload };
    case 'ADD_TO_WATCHLIST':
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter(item => item.movieId._id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'CLEAR_CURRENT_MOVIE':
      return { ...state, currentMovie: null, reviews: [] };
    default:
      return state;
  }
};

interface MovieContextType extends MovieState {
  fetchMovies: (page?: number) => Promise<void>;
  fetchMovieById: (movieId: string) => Promise<void>;
  fetchMovieReviews: (movieId: string) => Promise<void>;
  addReview: (movieId: string, reviewData: { rating: number; reviewText?: string }) => Promise<void>;
  fetchWatchlist: (userId: string) => Promise<void>;
  addToWatchlist: (movieId: string) => Promise<void>;
  removeFromWatchlist: (movieId: string) => Promise<void>;
  setFilters: (filters: { genre?: string; year?: number; search?: string }) => void;
  clearCurrentMovie: () => void;
  clearError: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  const fetchMovies = async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {
        page,
        limit: 12,
        ...state.searchFilters,
      };
      const response = await moviesAPI.getMovies(params);
      dispatch({ type: 'SET_MOVIES', payload: response });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch movies' });
    }
  };

  const fetchMovieById = async (movieId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await moviesAPI.getMovieById(movieId);
      dispatch({ type: 'SET_CURRENT_MOVIE', payload: response.movie });
      if (response.review) {
        dispatch({ type: 'SET_REVIEWS', payload: response.review });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch movie' });
    }
  };

  const fetchMovieReviews = async (movieId: string) => {
    try {
      const response = await moviesAPI.getMovieReviews(movieId);
      dispatch({ type: 'SET_REVIEWS', payload: response.review });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch reviews' });
    }
  };

  const addReview = async (movieId: string, reviewData: { rating: number; reviewText?: string }) => {
    try {
      await moviesAPI.addReview(movieId, reviewData);
      // Refresh reviews after adding
      await fetchMovieReviews(movieId);
      // Refresh movie to get updated average rating
      await fetchMovieById(movieId);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add review' });
    }
  };

  const fetchWatchlist = async (userId: string) => {
    try {
      const response = await watchlistAPI.getWatchlist(userId);
      dispatch({ type: 'SET_WATCHLIST', payload: response.list });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch watchlist' });
    }
  };

  const addToWatchlist = async (movieId: string) => {
    try {
      await watchlistAPI.addToWatchlist(movieId);
      // Refresh watchlist to update UI
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        await fetchWatchlist(user._id);
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add to watchlist' });
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    try {
      await watchlistAPI.removeFromWatchlist(movieId);
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movieId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to remove from watchlist' });
    }
  };

  const setFilters = (filters: { genre?: string; year?: number; search?: string }) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearCurrentMovie = () => {
    dispatch({ type: 'CLEAR_CURRENT_MOVIE' });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <MovieContext.Provider
      value={{
        ...state,
        fetchMovies,
        fetchMovieById,
        fetchMovieReviews,
        addReview,
        fetchWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        setFilters,
        clearCurrentMovie,
        clearError,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
