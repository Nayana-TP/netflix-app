import axios from 'axios';

const API_KEY = '2ac243714eb51a261560fde07afdfaf1';
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
}

export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const movieApi = {
  getTrending: async (timeWindow: 'day' | 'week' = 'week'): Promise<ApiResponse> => {
    const response = await apiClient.get(`/trending/movie/${timeWindow}`);
    return response.data;
  },

  getPopular: async (page: number = 1): Promise<ApiResponse> => {
    const response = await apiClient.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  getTopRated: async (page: number = 1): Promise<ApiResponse> => {
    const response = await apiClient.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  getNowPlaying: async (page: number = 1): Promise<ApiResponse> => {
    const response = await apiClient.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  getUpcoming: async (page: number = 1): Promise<ApiResponse> => {
    const response = await apiClient.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
  },

  searchMovies: async (query: string, page: number = 1): Promise<ApiResponse> => {
    const response = await apiClient.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },
};

export const getImageUrl = (path: string, size: 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
};
