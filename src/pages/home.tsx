import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { HeroBanner } from '../components/hero-banner';
import { MovieRow } from '../components/movie-row';

interface Movie {
  id: string;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
}

export function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function loadMovies() {
      try {
        const [featured, trending, popular, topRated] = await Promise.all([
          api.get('/movies/featured'),
          api.get('/movies/trending'),
          api.get('/movies/popular'),
          api.get('/movies/top-rated'),
        ]);

        setFeaturedMovie(featured.data);
        setTrendingMovies(trending.data);
        setPopularMovies(popular.data);
        setTopRatedMovies(topRated.data);
      } catch (error) {
        console.error('Failed to load movies:', error);
      }
    }

    loadMovies();
  }, []);

  if (!featuredMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <HeroBanner movie={featuredMovie} />
      
      <div className="relative z-10 -mt-40 space-y-8 pb-16">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular on Netflix" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRatedMovies} />
      </div>
    </main>
  );
}