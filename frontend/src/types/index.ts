// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  joinDate: string;
}

// Movie Types
export interface Movie {
  _id: string;
  title: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  synopsis?: string;
  posterUrl?: string;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  userId: User;
  movieId: string;
  rating: number;
  reviewText?: string;
  timestamp: string;
}

// Watchlist Types
export interface WatchlistItem {
  _id: string;
  userId: string;
  movieId: Movie;
  dateAdded: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface MoviesResponse {
  total: number;
  page: number;
  pages: number;
  movies: Movie[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
