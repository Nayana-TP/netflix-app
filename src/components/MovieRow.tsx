import React from 'react';
import { Movie } from '../services/api';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-[160px]">
            <MovieCard movie={movie} onClick={onMovieClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
