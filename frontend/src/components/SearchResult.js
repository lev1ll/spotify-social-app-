import React from 'react';
import './SearchResult.css'; // ¡Nuevo CSS dedicado!

const SearchResult = ({ album, onSelect }) => {
  return (
    // La función onSelect se llama al hacer clic
    <div className="search-result-item" onClick={() => onSelect(album)}>
      <img 
        src={album.images[0]?.url} 
        alt={album.name} 
        className="search-result-image" 
      />
      <div className="search-result-info">
        <p className="search-result-name">{album.name}</p>
        <p className="search-result-artist">{album.artists[0].name}</p>
      </div>
    </div>
  );
};

export default SearchResult;