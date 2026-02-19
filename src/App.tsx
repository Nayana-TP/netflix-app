import React, { useState, useEffect } from 'react';
import FeaturedCarousel from './components/FeaturedCarousel';
import MovieRow from './components/MovieRow';
import AuthLanding from './components/AuthLanding';
import { useTrendingMovies, usePopularMovies, useTopRatedMovies, useNowPlayingMovies } from './hooks/useMovies';
import { Movie } from './services/api';
import { tokenStorage, User } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Only fetch movie data when user is logged in
  const { movies: trendingMovies, loading: trendingLoading, error: trendingError } = useTrendingMovies();
  const { movies: popularMovies, loading: popularLoading, error: popularError } = usePopularMovies();
  const { movies: topRatedMovies, loading: topRatedLoading, error: topRatedError } = useTopRatedMovies();
  const { movies: nowPlayingMovies, loading: nowPlayingLoading, error: nowPlayingError } = useNowPlayingMovies();

  useEffect(() => {
    // Check if user is already logged in
    const token = tokenStorage.getToken();
    const savedUser = tokenStorage.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    tokenStorage.removeToken();
    tokenStorage.removeUser();
    setUser(null);
  };

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie);
  };

  // Show auth landing if user is not logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthLanding onLoginSuccess={handleLoginSuccess} />;
  }

  // Only check loading states for movies when user is logged in
  if (trendingLoading || popularLoading || topRatedLoading || nowPlayingLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  if (trendingError || popularError || topRatedError || nowPlayingError) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Error loading movies. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-netflix-black to-transparent">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-netflix-red text-3xl font-bold">NETFLIX</h1>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <button className="text-white hover:text-gray-300 transition-colors">Home</button>
                <button className="text-white hover:text-gray-300 transition-colors">Movies</button>
                <button className="text-white hover:text-gray-300 transition-colors">TV Shows</button>
                <button className="text-white hover:text-gray-300 transition-colors">My List</button>
              </nav>
              <div className="flex items-center gap-4">
                <span className="text-white">Welcome, {user.user_name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <FeaturedCarousel movies={trendingMovies.slice(0, 5)} />
        
        <div className="container mx-auto px-8 py-8">
          <MovieRow
            title="Trending Now"
            movies={trendingMovies}
            onMovieClick={handleMovieClick}
          />
          <MovieRow
            title="Popular Movies"
            movies={popularMovies}
            onMovieClick={handleMovieClick}
          />
          <MovieRow
            title="Top Rated"
            movies={topRatedMovies}
            onMovieClick={handleMovieClick}
          />
          <MovieRow
            title="Now Playing"
            movies={nowPlayingMovies}
            onMovieClick={handleMovieClick}
          />
        </div>
      </main>

      <footer className="bg-netflix-dark py-8 mt-16">
        <div className="container mx-auto px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Netflix Clone. All rights reserved.</p>
            <p className="mt-2">Powered by TMDB API</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
