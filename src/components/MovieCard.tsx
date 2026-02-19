import React from 'react';
import { Movie } from '../services/api';
import { getImageUrl } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-md">
        <img
          src={getImageUrl(movie.poster_path, 'w300')}
          alt={movie.title}
          className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            <button className="bg-white text-netflix-black px-4 py-2 rounded-full text-sm font-semibold mb-2 hover:bg-gray-200 transition-colors">
              ▶ Play
            </button>
            <button className="bg-gray-600/70 text-white px-4 py-2 rounded-full text-sm font-semibold ml-2 hover:bg-gray-500/70 transition-colors">
              ℹ
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-gray-300 text-xs">{movie.vote_average.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
