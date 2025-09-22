import React, { useState } from 'react';
import './AlbumSearch.css';

// 1. Ahora recibe 'onAlbumSelect' como una nueva prop
const AlbumSearch = ({ token, onAlbumSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // ... (la lógica de búsqueda se mantiene igual)
    if (!searchTerm) return;
    const response = await fetch(`http://127.0.0.1:5000/search?q=${searchTerm}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const albumItems = data.albums.items || [];
    const uniqueAlbums = {};
    albumItems.forEach(album => {
      const key = `${album.name.toLowerCase()}|${album.artists[0].name.toLowerCase()}`;
      if (!uniqueAlbums[key]) {
        uniqueAlbums[key] = album;
      }
    });
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
          onKeyPress={event => event.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>Buscar</button>
      </div>

      <div className="results-container">
        {results.map(album => (
          // 2. Al hacer clic, llamamos a la función que nos pasó el padre
          <div key={album.id} className="album-result" onClick={() => onAlbumSelect(album.id)}>
            <img src={album.images[0]?.url} alt={album.name} />
            <p>{album.name} - {album.artists[0].name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumSearch;