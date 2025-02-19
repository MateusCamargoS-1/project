import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { useAuth } from '../store/auth';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import listMovies from '../services/listMovies.service';

export function Navbar() {
  const { logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newMovies, setNewMovies] = useState<string[]>([]);
  const [hasMobileNotification, setHasMobileNotification] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkForNewMovies = async () => {
      try {
        const movies = await listMovies();
        const movieTitles = movies.map(movie => movie.title);

        const storedMovies = JSON.parse(localStorage.getItem('knownMovies') || '[]');

        const addedMovies = movieTitles.filter(movie => !storedMovies.includes(movie));

        if (addedMovies.length > 0) {
          setNewMovies(addedMovies);
          setHasMobileNotification(true);
          localStorage.setItem('knownMovies', JSON.stringify(movieTitles));
        }
      } catch (error) {
        console.error('Erro ao buscar novos filmes:', error);
      }
    };

    checkForNewMovies();
    const interval = setInterval(checkForNewMovies, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearNotifications = () => {
    setNewMovies([]);
    setIsNotificationOpen(false);
  };

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setHasMobileNotification(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full px-4 lg:px-8 py-4 transition-colors duration-300',
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-netflix-red text-3xl font-bold">
            MAFLIX
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/movies" className="text-sm text-white hover:text-gray-300">
              Movies
            </Link>
            <Link to="/my-list" className="text-sm text-white hover:text-gray-300">
              My List
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/search" className="hidden sm:block">
            <Search className="w-5 h-5 text-white hover:text-gray-300" />
          </Link>
          
          <div className="relative">
            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <Bell className="w-5 h-5 text-white hover:text-gray-300" />
              {newMovies.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {isNotificationOpen && (
              <div
                className={cn(
                  'absolute mt-2 w-64 bg-black/90 text-white rounded-md shadow-lg py-2 px-4',
                  'sm:right-0 right-1/2 transform sm:translate-x-0 translate-x-1/2'
                )}
              >
                <h3 className="text-sm font-semibold mb-2">Novos Filmes</h3>
                {newMovies.length > 0 ? (
                  <ul className="space-y-1">
                    {newMovies.map((movie, index) => (
                      <li key={index} className="text-sm border-b border-white/10 pb-1">
                        {movie}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">Nenhum novo filme adicionado.</p>
                )}
                {newMovies.length > 0 && (
                  <button
                    className="mt-2 w-full text-sm text-center text-red-400 hover:text-red-500"
                    onClick={handleClearNotifications}
                  >
                    Limpar Notificações
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="flex items-center space-x-2"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 rounded-md shadow-lg py-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden relative" onClick={handleOpenMobileMenu}>
            <Menu className="w-6 h-6 text-white" />
            {hasMobileNotification && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/60">
          <div className="w-64 h-full bg-black/95 text-white p-4 flex flex-col space-y-6 transform transition-transform duration-500 ease-in-out translate-x-0">
            <button onClick={handleCloseMobileMenu} className="absolute top-4 right-4 text-white">
              <X className="w-6 h-6" />
            </button>

            <Link to="/" className="text-white text-lg hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/movies" className="text-white text-lg hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
              Movies
            </Link>
            <Link to="/my-list" className="text-white text-lg hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
              My List
            </Link>
            <Link to="/search" className="text-white text-lg hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
              Pesquisar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
