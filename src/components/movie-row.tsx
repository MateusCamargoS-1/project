import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface MovieRowProps {
  title: string;
  movies: any[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-12 space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showLeftArrow && isHovered && (
          <button
            className="absolute left-0 top-0 z-40 h-full w-16 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-scroll hide-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-[280px] sm:w-[320px] lg:w-[380px] group/card relative"
            >
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdropPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover brightness-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-lg mb-2">{movie.title}</h3>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/movie/${movie.id}`}
                      className="w-12 h-12 rounded-full bg-white hover:bg-white/80 flex items-center justify-center transition-transform hover:scale-110"
                    >
                      <Play className="w-6 h-6 text-black" fill="currentColor" />
                    </Link>
                    <button className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center transition-transform hover:scale-110">
                      <Plus className="w-6 h-6 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center transition-transform hover:scale-110">
                      <ThumbsUp className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && isHovered && (
          <button
            className="absolute right-0 top-0 z-40 h-full w-16 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
