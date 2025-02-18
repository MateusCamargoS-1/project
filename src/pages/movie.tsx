import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp, Share2 } from 'lucide-react';
import { api } from '../lib/axios';
import  Button  from '../components/ui/button';

interface Movie {
  id: string;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: string[];
  runtime: number;
  trailer_url?: string;
}

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    }

    loadMovie();
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
      <div className="relative h-[70vh]">
        {showTrailer && movie.trailer_url ? (
          <div className="absolute inset-0 bg-black">
            <iframe
              src={movie.trailer_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
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
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
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
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>{movie.runtime} min</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <Button 
                  size="lg" 
                  className="flex items-center space-x-2"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play className="w-5 h-5" />
                  <span>Play Trailer</span>
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
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {genre}
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