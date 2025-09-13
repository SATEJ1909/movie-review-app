import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  MoviesResponse, 
  Movie, 
  Review, 
  WatchlistItem,
  User
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post('/user/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/user/login', credentials);
    return response.data;
  },

  getProfile: async (userId: string): Promise<{ success: boolean; message: string; user: User }> => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<{ success: boolean; message: string; user: User }> => {
    const response = await api.post('/user/updateProfile', profileData);
    return response.data;
  },
};

// Movies API
export const moviesAPI = {
  getMovies: async (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    year?: number;
  }): Promise<MoviesResponse> => {
    const response = await api.get('/movie/getMovies', { params });
    return response.data;
  },

  getMovieById: async (movieId: string): Promise<{ success: boolean; message: string; movie: Movie; review: Review[] }> => {
    const response = await api.get(`/movie/getMoviebyId/${movieId}`);
    return response.data;
  },

  addMovie: async (movieData: Omit<Movie, '_id' | 'averageRating' | 'createdAt' | 'updatedAt'>): Promise<{ message: string }> => {
    const response = await api.post('/movie/addMovie', movieData);
    return response.data;
  },

  getMovieReviews: async (movieId: string): Promise<{ success: boolean; message: string; review: Review[] }> => {
    const response = await api.get(`/movie/${movieId}/reviews`);
    return response.data;
  },

  addReview: async (movieId: string, reviewData: { rating: number; reviewText?: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/movie/${movieId}/review`, reviewData);
    return response.data;
  },
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: async (userId: string): Promise<{ success: boolean; message: string; list: WatchlistItem[] }> => {
    const response = await api.get(`/user/${userId}/watchlist`);
    return response.data;
  },

  addToWatchlist: async (movieId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/user/addtoWatchList', { movieId });
    return response.data;
  },

  removeFromWatchlist: async (movieId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/user/removeFromWatchList', { movieId });
    return response.data;
  },
};

export default api;
