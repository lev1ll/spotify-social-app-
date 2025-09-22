import { useState, useEffect } from 'react';
import './App.css';
import ArtistsList from './components/ArtistsList';
import TracksList from './components/TracksList';

function App() {
  // ... (toda la lógica de useState y useEffect se mantiene igual)
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let accessToken = null;
    if (hash) {
      accessToken = hash.substring(1).split('&').find(elem => elem.startsWith('token=')).split('=')[1];
      window.location.hash = '';
    }
    if (accessToken) {
      setToken(accessToken);
    }
    const fetchData = async (token) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/dashboard-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setArtists(data.artists || []);
        setTracks(data.tracks || []);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    if (accessToken) {
      fetchData(accessToken);
    }
  }, []);

  return (
    <div className="App">
      <h1>Tu Dashboard de Spotify</h1>
      
      {token ? (
        <div className="dashboard-container">
          <div className="dashboard-column">
            <TracksList tracks={tracks} />
          </div>
          <div className="dashboard-column">
            <ArtistsList artists={artists} />
          </div>
        </div>
      ) : (
        <a href="http://127.0.0.1:5000/login" className="login-button">
          Iniciar Sesión con Spotify
        </a>
      )}
    </div>
  );
}
export default App;