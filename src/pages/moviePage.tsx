import { useEffect, useState } from "react";
import listMovies from "../services/listMovies.service";
import { Navbar } from "../components/navbar";
import { MovieCard } from "../components/movie-card";

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  genres: { id: number; name: string }[];
}

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await listMovies();

        const allGenres = new Set<string>();
        moviesData.forEach((movie: Movie) => {
          movie.genres.forEach((genre) => allGenres.add(genre.name));
        });

        setMovies(moviesData);
        setFilteredMovies(moviesData);
        setGenres(Array.from(allGenres));
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let updatedMovies = [...movies];

    if (selectedGenre) {
      updatedMovies = updatedMovies.filter((movie) =>
        movie.genres.some((genre) => genre.name === selectedGenre)
      );
    }

    if (searchQuery.trim() !== "") {
      updatedMovies = updatedMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(updatedMovies);
  }, [searchQuery, selectedGenre, movies]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="relative z-10 py-20 px-6 sm:px-10">
        <h1 className="text-4xl font-bold text-red-600 mb-6 tracking-wide">
          Catálogo de Filmes
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Pesquisar filmes..."
            className="w-full sm:w-80 p-3 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="w-full sm:w-60 p-3 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
            onChange={(e) => setSelectedGenre(e.target.value || null)}
          >
            <option value="">Todos os Gêneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
