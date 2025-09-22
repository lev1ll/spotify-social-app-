import React, { useState } from 'react';
import './AlbumSearch.css';

const AlbumSearch = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm) return;

    const response = await fetch(`http://127.0.0.1:5000/search?q=${searchTerm}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    // --- ¡LÓGICA MEJORADA! ---
    const albumItems = data.albums.items || [];
    
    // Usamos un objeto para rastrear los álbumes únicos por su nombre y artista
    const uniqueAlbums = {};
    albumItems.forEach(album => {
      const key = `${album.name.toLowerCase()}|${album.artists[0].name.toLowerCase()}`;
      if (!uniqueAlbums[key]) {
        uniqueAlbums[key] = album;
      }
    });

    // Convertimos el objeto de vuelta a un array y lo guardamos en el estado
    setResults(Object.values(uniqueAlbums));
  };

  return (
    <div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Busca un álbum..." 
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          // Permite buscar presionando Enter
          onKeyPress={event => event.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>Buscar</button>
      </div>

      <div className="results-container">
        {results.map(album => (
          <div key={album.id} className="album-result">
            <img src={album.images[0]?.url} alt={album.name} />
            <p>{album.name} - {album.artists[0].name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumSearch;