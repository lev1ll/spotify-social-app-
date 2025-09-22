import React from 'react';

const TracksList = ({ tracks }) => {
  return (
    <div>
      <h2>Tus 10 Canciones Favoritas</h2>
      <ol>
        {tracks.map(track => (
          <li key={track.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            
            {/* Las canciones tienen la imagen dentro de track.album.images */}
            {track.album.images && track.album.images[0] && (
              <img 
                src={track.album.images[0].url} 
                alt={`Carátula del álbum ${track.album.name}`} 
                width="50" 
                height="50"
                style={{ marginRight: '10px' }}
              />
            )}
            
            <div>
              <strong>{track.name}</strong>
              <br />
              <small>{track.artists[0].name}</small>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TracksList;