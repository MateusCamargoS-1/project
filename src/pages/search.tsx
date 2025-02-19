import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { api } from '../lib/axios';
import { MovieCard } from '../components/movie-card';
import { Navbar } from '../components/navbar';

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<number>();

  useEffect(() => {
    if (query.length >= 2) {
      clearTimeout(searchTimeout.current);

      searchTimeout.current = window.setTimeout(async () => {
        setIsLoading(true);
        try {
          const [searchResults, suggestionsResults] = await Promise.all([
            api.get(`/movies/search?q=${query}`),
            api.get(`/movies/suggestions?q=${query}`),
          ]);

          setResults(searchResults.data);
          setSuggestions(suggestionsResults.data);
        } catch (error) {
          console.error('Pesquisa falhou:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      navigate(`/search?q=${query}`, { replace: true });
    } else {
      setResults([]);
      setSuggestions([]);
    }

    return () => clearTimeout(searchTimeout.current);
  }, [query, navigate]);

  return (
    <div className="min-h-screen pt-24 px-8">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies or TV shows"
              className="w-full pl-12 pr-10 py-4 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && query.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-zinc-900 rounded-lg border border-zinc-700 shadow-lg"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        ) : query.length >= 2 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400">
              Nenhum resultado encontrado para "{query}"
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}