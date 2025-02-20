import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/auth';
import  Button  from '../components/ui/button';

import bgLogin from '../assets/login.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { login,  isAuthenticated } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(usuario, password);
      navigate('/');
    } catch (err) {
      setError('Email ou Senha Inválido!');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8 bg-black/75 rounded-lg"
      >
        <h1 className="text-3xl font-bold mb-8">Login</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-4 rounded bg-zinc-800 border border-zinc-700 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded bg-zinc-800 border border-zinc-700 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className="text-gray-400 text-center">
            Novo na Mflix?{' '}
            <Link to="/register" className="text-white hover:underline">
              Criar agora
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}