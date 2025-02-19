import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp, Share2, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/button';
import listMovies from '../services/listMovies.service';
import { VideoPlayer } from '../components/VideoPlayer';
import { Navbar } from '../components/navbar';

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movies = await listMovies();
        const foundMovie = movies.find(m => m.id === Number(id));
        setMovie(foundMovie);
        if (!foundMovie) {
          return setError('Não foi possível carregar o filme');
        }
      } catch (error) {
        setError('Falha ao carregar detalhes do filme');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* A Navbar será renderizada apenas se showTrailer for falso */}
      {!showTrailer && <Navbar />}
      <div className="relative h-[100vh]">
        {showTrailer && movie.backdropPath ? (
          <div className="absolute inset-0 bg-black">
            <div className="fixed top-0 left-0 z-50 p-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition"
              >
                <ArrowLeft size={24} />
                <span>Back to Browse</span>
              </Link>
            </div>
            <VideoPlayer
              movieId={movie.id}
              streamUrl={`https://mflix.moleniuk.com/api/stream/${movie.id}`}
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/75"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="absolute inset-0">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 netflix-gradient" />
            </div>

            <motion.div
              className="absolute bottom-0 left-0 p-8 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-green-500 font-medium">
                  {Math.round(movie.voteAverage * 10)}% Match
                </span>
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                <span>{movie.runtime} min</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <Button
                  size="lg"
                  className="flex items-center space-x-2"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </Button>
                <Button variant="secondary" size="lg" className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>My List</span>
                </Button>
                <Button variant="secondary" size="lg" className="flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg" className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-lg text-gray-200 mb-4">{movie.overview}</p>

              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Genres:</span>
                <div className="flex items-center space-x-2">
                  {movie.genres.map((genre: any) => (
                    <span
                      key={genre.idGenres}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
