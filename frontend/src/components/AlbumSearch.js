import React from 'react';
import './AlbumSearch.css'; // Crearemos este CSS

const AlbumSearch = () => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Busca un álbum..." 
        className="search-input"
      />
      <button className="search-button">Buscar</button>
    </div>
  );
};

export default AlbumSearch;