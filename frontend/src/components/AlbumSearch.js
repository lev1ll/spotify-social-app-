import React, { useState } from 'react';
import './AlbumSearch.css';

const AlbumSearch = ({ token, onAlbumSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
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

  // ¡NUEVA FUNCIÓN!
  const handleSelect = (album) => {
    onAlbumSelect(album); // 1. Llama a la función del padre para añadir el álbum
    setResults([]);       // 2. ¡MAGIA! Vacía los resultados de búsqueda
    setSearchTerm('');    // 3. Opcional: limpia la barra de búsqueda
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

      {/* Solo mostramos los resultados si hay alguno */}
      {results.length > 0 && (
        <div className="results-container">
          {results.map(album => (
            // El onClick ahora llama a nuestra nueva función handleSelect
            <div key={album.id} className="album-result" onClick={() => handleSelect(album)}>
              <img src={album.images[0]?.url} alt={album.name} />
              <p>{album.name} - {album.artists[0].name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumSearch;