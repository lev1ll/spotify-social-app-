import React from 'react';
import './Lists.css'; // ¡Importamos el nuevo CSS!

const ArtistsList = ({ artists }) => {
  return (
    <div>
      <h2>Tus Artistas Favoritos</h2>
      <ol className="list-container">
        {artists.map(artist => (
          <li key={artist.id} className="list-item">
            {artist.images && artist.images[0] && (
              <img src={artist.images[0].url} alt={artist.name} />
            )}
            <div className="list-item-info">
              <strong>{artist.name}</strong>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
export default ArtistsList;