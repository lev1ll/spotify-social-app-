import React, { useState } from 'react'; // Solo necesitamos useState aquí
import AlbumSearch from '../components/AlbumSearch';
import TierRow from '../components/TierRow';

const TierListPage = ({ token }) => {
  // 1. Nuevo estado para guardar las canciones del álbum seleccionado
  const [albumTracks, setAlbumTracks] = useState([]);

  const tiers = [
    { title: 'S', color: '#ff7f7f' },
    { title: 'A', color: '#ffbf7f' },
    { title: 'B', color: '#ffff7f' },
    { title: 'C', color: '#7fff7f' },
    { title: 'D', color: '#7fbfff' },
  ];
  
  // 2. Nueva función que se ejecutará cuando un usuario haga clic en un álbum
  const handleAlbumSelect = async (albumId) => {
    const response = await fetch(`http://127.0.0.1:5000/album-tracks/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setAlbumTracks(data.items || []); // Guardamos las canciones en nuestro nuevo estado
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Creador de Tier Lists</h2>
      {/* 3. Pasamos la nueva función como prop al buscador */}
      <AlbumSearch token={token} onAlbumSelect={handleAlbumSelect} />
      
      {/* 4. "Cajón" para las canciones pendientes */}
      <div className="pending-tracks-container">
        <h3>Canciones Pendientes</h3>
        {albumTracks.map(track => (
          <div key={track.id} className="track-item">
            {track.name}
          </div>
        ))}
      </div>

      <div className="tier-list-container">
        {tiers.map(tier => (
          <TierRow key={tier.title} title={tier.title} color={tier.color} />
        ))}
      </div>
    </div>
  );
};

export default TierListPage;