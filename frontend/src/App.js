import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Importamos nuestros componentes y páginas
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import TierListPage from './pages/TierListPage';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let accessToken = hash.substring(1).split('&').find(elem => elem.startsWith('token='));
    if (accessToken) {
      accessToken = accessToken.split('=')[1];
      window.location.hash = '';
      setToken(accessToken);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Tu Aplicación Musical</h1>
        
        {token ? (
          <>
            <Navbar />
            <Routes>
              <Route path="/dashboard" element={<DashboardPage token={token} />} />
              <Route path="/tierlist" element={<TierListPage />} />
            </Routes>
          </>
        ) : (
          <a href="http://127.0.0.1:5000/login" className="login-button">
            Iniciar Sesión con Spotify
          </a>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;