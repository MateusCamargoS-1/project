import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import  Button  from './ui/button';
import { useNavigate } from 'react-router-dom';

// interface Movie {
//   id: string;
//   title: string;
//   overview: string;
//   backdrop_path: string;
// }

// interface HeroBannerProps {
//   movie: Movie;
// }

export function HeroBanner({ movie }: any) {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/movie/${movie.id}`); 
  };

  return (
    <div className="relative h-[85vh] w-full">
      <div className="absolute inset-0">
        <img
          src={movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 netflix-gradient" />
      </div>
      
      <motion.div 
        className="absolute bottom-[25%] left-8 max-w-xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
        <p className="text-lg mb-6">{movie.overview}</p>
        <div className="flex space-x-4">
          <Button size="lg" className="flex items-center space-x-2">
            <Play className="w-5 h-5" onClick={handlePlayClick}/>
            <span>Play</span>
          </Button>
          <Button variant="secondary" size="lg" className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>More Info</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}