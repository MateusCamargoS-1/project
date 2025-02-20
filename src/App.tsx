import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { MoviePage } from './pages/movie';
import { SearchPage } from './pages/search';
import { ProtectedRoute } from './components/protected-route';
import { NotFoundPage } from './pages/notFoundPage';
import { ProfilePage } from './pages/profilePage';
import { MoviesPage } from './pages/moviePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MoviePage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;