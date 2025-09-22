import { useState, useEffect } from 'react';
import './App.css';

// Importamos ambos componentes
import ArtistsList from './components/ArtistsList';
import TracksList from './components/TracksList';

function App() {
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]); // ¡Las canciones vuelven!

  useEffect(() => {
    const hash = window.location.hash;
    let accessToken = null;

    if (hash) {
      accessToken = hash.substring(1).split('&').find(elem => elem.startsWith('token=')).split('=')[1];
      // Limpiamos el hash de la URL para que se vea más limpio
      window.location.hash = '';
    }

    if (accessToken) {
      setToken(accessToken);
    }

    const fetchData = async (token) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/dashboard-data', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        setArtists(data.artists || []);
        setTracks(data.tracks || []);
      } catch (error) {
        console.error("Error al obtener los datos del backend:", error);
      }
    };

    if (accessToken) {
      fetchData(accessToken);
    }

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tu Dashboard de Spotify</h1>
        
        {token ? (
          // Usamos un "Fragmento" (<>) para devolver dos componentes hermanos
          <>
            <TracksList tracks={tracks} />
            <hr style={{ margin: '30px 0', width: '100%' }} />
            <ArtistsList artists={artists} />
          </>
        ) : (
          <a href="http://127.0.0.1:5000/login" className="login-button">
            Iniciar Sesión con Spotify
          </a>
        )}
      </header>
    </div>
  );
}

export default App;