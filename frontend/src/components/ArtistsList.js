import React from 'react';

const ArtistsList = ({ artists }) => {
  return (
    <div>
      <h2>Tus 10 Artistas Favoritos</h2>
      <ol>
        {artists.map(artist => (
          <li key={artist.id}>
            {/* Mostramos la primera imagen del artista si existe */}
            {artist.images && artist.images[0] && (
              <img 
                src={artist.images[0].url} 
                alt={artist.name} 
                width="50" 
                height="50" 
              />
            )}
            <strong>{artist.name}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ArtistsList;