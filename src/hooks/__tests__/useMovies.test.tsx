import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTrendingMovies, usePopularMovies, useTopRatedMovies, useNowPlayingMovies } from '../useMovies';
import * as apiService from '../../services/api';

vi.mock('../../services/api');

const mockedMovieApi = vi.mocked(apiService.movieApi);

describe('useMovies Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useTrendingMovies', () => {
    it('should fetch trending movies successfully', async () => {
      const mockMovies = [
        {
          id: 1,
          title: 'Trending Movie 1',
          overview: 'Overview 1',
          poster_path: '/poster1.jpg',
          backdrop_path: '/backdrop1.jpg',
          vote_average: 8.5,
          release_date: '2023-01-01',
          genre_ids: [1, 2],
        },
        {
          id: 2,
          title: 'Trending Movie 2',
          overview: 'Overview 2',
          poster_path: '/poster2.jpg',
          backdrop_path: '/backdrop2.jpg',
          vote_average: 7.8,
          release_date: '2023-02-01',
          genre_ids: [3, 4],
        },
      ];

      mockedMovieApi.getTrending.mockResolvedValue({
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: 2,
      });

      const { result } = renderHook(() => useTrendingMovies());

      expect(result.current.loading).toBe(true);
      expect(result.current.movies).toEqual([]);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual(mockMovies);
      expect(result.current.error).toBe(null);
      expect(mockedMovieApi.getTrending).toHaveBeenCalledWith('week');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch trending movies';
      mockedMovieApi.getTrending.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTrendingMovies());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('usePopularMovies', () => {
    it('should fetch popular movies successfully', async () => {
      const mockMovies = [
        {
          id: 3,
          title: 'Popular Movie',
          overview: 'Popular Overview',
          poster_path: '/popular.jpg',
          backdrop_path: '/popular_backdrop.jpg',
          vote_average: 9.0,
          release_date: '2023-03-01',
          genre_ids: [5, 6],
        },
      ];

      mockedMovieApi.getPopular.mockResolvedValue({
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: 1,
      });

      const { result } = renderHook(() => usePopularMovies(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual(mockMovies);
      expect(mockedMovieApi.getPopular).toHaveBeenCalledWith(1);
    });
  });

  describe('useTopRatedMovies', () => {
    it('should fetch top rated movies successfully', async () => {
      const mockMovies = [
        {
          id: 4,
          title: 'Top Rated Movie',
          overview: 'Top Rated Overview',
          poster_path: '/toprated.jpg',
          backdrop_path: '/toprated_backdrop.jpg',
          vote_average: 9.5,
          release_date: '2023-04-01',
          genre_ids: [7, 8],
        },
      ];

      mockedMovieApi.getTopRated.mockResolvedValue({
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: 1,
      });

      const { result } = renderHook(() => useTopRatedMovies(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual(mockMovies);
      expect(mockedMovieApi.getTopRated).toHaveBeenCalledWith(1);
    });
  });

  describe('useNowPlayingMovies', () => {
    it('should fetch now playing movies successfully', async () => {
      const mockMovies = [
        {
          id: 5,
          title: 'Now Playing Movie',
          overview: 'Now Playing Overview',
          poster_path: '/nowplaying.jpg',
          backdrop_path: '/nowplaying_backdrop.jpg',
          vote_average: 8.2,
          release_date: '2023-05-01',
          genre_ids: [9, 10],
        },
      ];

      mockedMovieApi.getNowPlaying.mockResolvedValue({
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: 1,
      });

      const { result } = renderHook(() => useNowPlayingMovies(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual(mockMovies);
      expect(mockedMovieApi.getNowPlaying).toHaveBeenCalledWith(1);
    });
  });
});
