import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // --- ¡GRAN CAMBIO! ---
    // 1. Extraer el token de la URL
    const hash = window.location.hash;
    let accessToken = null;

    if (hash) {
      accessToken = hash.substring(1).split('&').find(elem => elem.startsWith('token=')).split('=')[1];
    }

    if (accessToken) {
      setToken(accessToken);
    }

    // 2. Si tenemos un token, pedimos los datos
    const fetchData = async (token) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/dashboard-data', {
          headers: {
            // 3. Enviamos el token en el encabezado Authorization
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        setTracks(data.tracks || []); // Usamos || [] por seguridad
        setArtists(data.artists || []);
      } catch (error) {
        console.error("Error al obtener los datos del backend:", error);
      }
    };

    if (accessToken) {
      fetchData(accessToken);
    }

  }, []); // Se ejecuta solo una vez

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tu Dashboard de Spotify</h1>
        
        {token ? (
          <>
            <div>
              <h2>Tus 10 Canciones Favoritas</h2>
              <ol>
                {tracks.map(track => (
                  <li key={track.id}>{track.name} - <strong>{track.artists[0].name}</strong></li>
                ))}
              </ol>
            </div>

            <div>
              <h2>Tus 10 Artistas Favoritos</h2>
              <ol>
                {artists.map(artist => (
                  <li key={artist.id}><strong>{artist.name}</strong></li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          // 4. Si no hay token, mostramos un botón de login
          <a href="http://127.0.0.1:5000/login" className="login-button">
            Iniciar Sesión con Spotify
          </a>
        )}
      </header>
    </div>
  );
}

export default App;