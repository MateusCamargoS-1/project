import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/auth';
import  Button  from '../components/ui/button';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2069&auto=format&fit=crop)' }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8 bg-black/75 rounded-lg"
      >
        <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded bg-zinc-800 border border-zinc-700 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <p className="text-gray-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}