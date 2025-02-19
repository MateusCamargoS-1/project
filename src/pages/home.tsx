import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { HeroBanner } from '../components/hero-banner';
import { MovieRow } from '../components/movie-row';
import listMovies from '../services/listMovies.service';
import { Movie } from '../types/@types';
import { Navbar } from '../components/navbar';

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await listMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  if (!movies.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop
        className="relative z-0"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <HeroBanner movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative z-10 space-y-8 pb-16">
        <MovieRow title="Em Destaque" movies={movies} />
        <MovieRow title="Popular na Netflix" movies={movies} />
        <MovieRow title="Top da semana" movies={movies} />
      </div>
    </main>
  );
}
