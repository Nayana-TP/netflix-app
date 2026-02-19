import React, { useState, useEffect } from 'react';
import { Movie } from '../services/api';
import { getImageUrl } from '../services/api';

interface FeaturedCarouselProps {
  movies: Movie[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div className="relative h-[70vh] bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Loading featured movies...</div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path, 'w1280')})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {currentMovie.title}
            </h1>
            <p className="text-lg text-gray-200 mb-6 line-clamp-3">
              {currentMovie.overview}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <span className="text-white font-semibold">
                  {currentMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            </div>
            <div className="flex gap-4">
              <button className="bg-white text-netflix-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors">
                ▶ Play
              </button>
              <button className="bg-gray-600/70 text-white px-8 py-3 rounded font-semibold hover:bg-gray-500/70 transition-colors">
                ℹ More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
      >
        ›
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
