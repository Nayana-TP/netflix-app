import { useState, useEffect } from 'react';
import { movieApi, ApiResponse, Movie, MovieDetails } from '../services/api';

export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'week') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getTrending(timeWindow);
        setMovies(response.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch trending movies');
        console.error('Error fetching trending movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [timeWindow]);

  return { movies, loading, error };
};

export const usePopularMovies = (page: number = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getPopular(page);
        setMovies(response.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch popular movies');
        console.error('Error fetching popular movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};

export const useTopRatedMovies = (page: number = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getTopRated(page);
        setMovies(response.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch top rated movies');
        console.error('Error fetching top rated movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};

export const useNowPlayingMovies = (page: number = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getNowPlaying(page);
        setMovies(response.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch now playing movies');
        console.error('Error fetching now playing movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};

export const useMovieDetails = (movieId: number) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieDetails = await movieApi.getMovieDetails(movieId);
        setMovie(movieDetails);
        setError(null);
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  return { movie, loading, error };
};
