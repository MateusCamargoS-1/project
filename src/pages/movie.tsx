import { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Plus, ThumbsUp, Share2, ArrowLeft, Info } from "lucide-react";
import Button from "../components/ui/button";
import listMovies from "../services/listMovies.service";
import { VideoPlayer }  from "../components/VideoPlayer";
import { Navbar } from "../components/navbar";
import { MovieRow } from "../components/movie-row";

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movies = await listMovies();
        const foundMovie = movies.find((m) => m.id === Number(id));
        setMovie(foundMovie);
        
        if (foundMovie && foundMovie.genres.length > 0) {
          const similar = movies.filter(m => 
            m.id !== foundMovie.id && 
            m.genres.some((g: any) => 
              foundMovie.genres.some((fg: any) => fg.idGenres === g.idGenres)
            )
          ).slice(0, 12);
          setSimilarMovies(similar);
        }

        if (!foundMovie) {
          return setError("Não foi possível carregar o filme");
        }
      } catch (error) {
        setError("Falha ao carregar detalhes do filme");
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-lg text-netflix-red">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {!showTrailer && <Navbar />}
      <div className="relative">
        {showTrailer ? (
          <div className="absolute inset-0 bg-black">
            <div className="fixed top-4 left-4 z-50">
              <button
                onClick={() => setShowTrailer(false)}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition px-4 py-2 rounded-full bg-black/40 hover:bg-black/60"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar</span>
              </button>
            </div>
            <VideoPlayer
              movieId={movie.id}
              streamUrl={`https://mflix.moleniuk.com/api/stream/${movie.id}`}
              coverImage={movie.backdropPath}
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="relative w-full h-full">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
            </div>

            <motion.div
              className="relative pt-[20vh] px-4 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto"
              style={{paddingTop: "23%"}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full lg:w-[50%] xl:w-[45%]">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {movie.title}
                </motion.h1>

                <motion.div 
                  className="flex flex-wrap items-center gap-3 mb-4 text-sm sm:text-base text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-green-500 font-medium">
                    {Math.round(movie.voteAverage * 10)}% Match
                  </span>
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  <span>{movie.runtime} min</span>
                  <span className="px-1.5 py-0.5 text-xs border border-white/40 rounded">HD</span>
                </motion.div>

                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className={`text-base sm:text-lg text-white/80 ${!showFullOverview && 'line-clamp-3'}`}>
                    {movie.overview}
                  </p>
                  {movie.overview.length > 200 && (
                    <button
                      onClick={() => setShowFullOverview(!showFullOverview)}
                      className="text-white/60 hover:text-white text-sm font-medium mt-2 flex items-center gap-1"
                    >
                      {showFullOverview ? 'Show less' : 'More info'}
                      <Info className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>

                <motion.div 
                  className="flex flex-wrap items-center gap-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    size="lg"
                    className="h-12 px-8 flex items-center gap-2 bg-white hover:bg-white/90 text-black"
                    onClick={() => setShowTrailer(true)}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span className="font-semibold">Play</span>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="h-12 px-6 flex items-center gap-2 bg-white/20 hover:bg-white/30"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">My List</span>
                  </Button>
                  <Button 
                    variant="secondary"
                    size="lg"
                    className="h-12 w-12 flex items-center justify-center p-0 bg-white/20 hover:bg-white/30 rounded-full"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="secondary"
                    size="lg"
                    className="h-12 w-12 flex items-center justify-center p-0 bg-white/20 hover:bg-white/30 rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </motion.div>

                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Gêneros:</span>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre: any) => (
                        <span
                          key={genre.idGenres}
                          className="text-sm text-white/80"
                        >
                          {genre.name}
                          {genre !== movie.genres[movie.genres.length - 1] && " •"}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {!showTrailer && similarMovies.length > 0 && (
        <motion.div 
          className="relative z-10 px-4 sm:px-8 lg:px-12 pt-8 pb-16 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <MovieRow title="Assista Agora" movies={similarMovies} />
        </motion.div>
      )}
    </div>
  );
}