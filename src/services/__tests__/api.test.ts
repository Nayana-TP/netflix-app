import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { movieApi, getImageUrl } from '../api';

// Mock axios module
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('movieApi.getTrending', () => {
    it('should fetch trending movies successfully', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [
            {
              id: 1,
              title: 'Test Movie',
              overview: 'Test Overview',
              poster_path: '/test.jpg',
              backdrop_path: '/test_backdrop.jpg',
              vote_average: 8.5,
              release_date: '2023-01-01',
              genre_ids: [1, 2],
            },
          ],
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieApi.getTrending();

      expect(result).toEqual(mockResponse.data);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].title).toBe('Test Movie');
    });

    it('should handle API errors', async () => {
      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      });

      await expect(movieApi.getTrending()).rejects.toThrow('API Error');
    });
  });

  describe('movieApi.getPopular', () => {
    it('should fetch popular movies with pagination', async () => {
      const mockResponse = {
        data: {
          page: 2,
          results: [
            {
              id: 2,
              title: 'Popular Movie',
              overview: 'Popular Overview',
              poster_path: '/popular.jpg',
              backdrop_path: '/popular_backdrop.jpg',
              vote_average: 9.0,
              release_date: '2023-02-01',
              genre_ids: [3, 4],
            },
          ],
          total_pages: 10,
          total_results: 200,
        },
      };

      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieApi.getPopular(2);

      expect(result.page).toBe(2);
      expect(result.results[0].title).toBe('Popular Movie');
    });
  });

  describe('movieApi.getMovieDetails', () => {
    it('should fetch detailed movie information', async () => {
      const mockResponse = {
        data: {
          id: 123,
          title: 'Detailed Movie',
          overview: 'Detailed Overview',
          poster_path: '/detailed.jpg',
          backdrop_path: '/detailed_backdrop.jpg',
          vote_average: 8.7,
          release_date: '2023-03-01',
          genre_ids: [5, 6],
          genres: [
            { id: 5, name: 'Action' },
            { id: 6, name: 'Adventure' },
          ],
          runtime: 120,
          tagline: 'Test Tagline',
          status: 'Released',
          budget: 100000000,
          revenue: 200000000,
        },
      };

      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieApi.getMovieDetails(123);

      expect(result.id).toBe(123);
      expect(result.genres).toHaveLength(2);
      expect(result.runtime).toBe(120);
      expect(result.tagline).toBe('Test Tagline');
    });
  });

  describe('movieApi.searchMovies', () => {
    it('should search movies by query', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [
            {
              id: 456,
              title: 'Search Result Movie',
              overview: 'Search Result Overview',
              poster_path: '/search.jpg',
              backdrop_path: '/search_backdrop.jpg',
              vote_average: 7.5,
              release_date: '2023-04-01',
              genre_ids: [7, 8],
            },
          ],
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieApi.searchMovies('Search Query');

      expect(result.results[0].title).toBe('Search Result Movie');
    });
  });
});

describe('getImageUrl', () => {
  it('should generate correct image URL with default size', () => {
    const path = '/test_image.jpg';
    const result = getImageUrl(path);
    expect(result).toBe('https://image.tmdb.org/t/p/w500/test_image.jpg');
  });

  it('should generate correct image URL with custom size', () => {
    const path = '/test_image.jpg';
    const result = getImageUrl(path, 'w300');
    expect(result).toBe('https://image.tmdb.org/t/p/w300/test_image.jpg');
  });

  it('should handle empty path', () => {
    const result = getImageUrl('');
    expect(result).toBe('');
  });

  it('should handle null path', () => {
    const result = getImageUrl(null as any);
    expect(result).toBe('');
  });
});
