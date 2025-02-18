import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../store/auth';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 z-50 w-full px-4 lg:px-8 py-4 transition-colors duration-300',
      isScrolled ? 'bg-background' : 'bg-transparent'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-netflix-red text-3xl font-bold">NETFLIX</Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm text-white hover:text-gray-300">Home</Link>
            <Link to="/series" className="text-sm text-white hover:text-gray-300">Series</Link>
            <Link to="/movies" className="text-sm text-white hover:text-gray-300">Movies</Link>
            <Link to="/new" className="text-sm text-white hover:text-gray-300">New & Popular</Link>
            <Link to="/my-list" className="text-sm text-white hover:text-gray-300">My List</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/search">
            <Search className="w-5 h-5 text-white hover:text-gray-300" />
          </Link>
          <button>
            <Bell className="w-5 h-5 text-white hover:text-gray-300" />
          </button>
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-black/90 rounded-md shadow-lg py-1 invisible group-hover:visible">
              <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-white/10">Profile</Link>
              <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}