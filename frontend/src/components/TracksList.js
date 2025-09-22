import React from 'react';
import './Lists.css'; // ¡Importamos el nuevo CSS!

const TracksList = ({ tracks }) => {
  return (
    <div>
      <h2>Tus Canciones Favoritas</h2>
      <ol className="list-container">
        {tracks.map(track => (
          <li key={track.id} className="list-item">
            {track.album.images && track.album.images[0] && (
              <img src={track.album.images[0].url} alt={`Carátula de ${track.album.name}`} />
            )}
            <div className="list-item-info">
              <strong>{track.name}</strong>
              <small>{track.artists[0].name}</small>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
export default TracksList;