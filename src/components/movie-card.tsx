import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// interface Movie {
//   id: string;
//   title: string;
//   poster_path: string;
//   vote_average: number;
// }

// interface MovieCardProps {
//   movie: Movie;
//   index: number;
// }

export function MovieCard({ movie, index }: any) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] rounded-md overflow-hidden">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80">
                    <Play className="w-4 h-4 text-black" />
                  </button>
                  <button className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center hover:border-white">
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center hover:border-white">
                    <ThumbsUp className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="text-sm font-medium text-green-500">
                  {Math.round(movie.vote_average * 10)}% Match
                </div>
              </div>
              <h3 className="text-sm font-medium text-white">{movie.title}</h3>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}