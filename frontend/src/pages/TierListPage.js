import React from 'react';
import AlbumSearch from '../components/AlbumSearch';
import TierRow from '../components/TierRow'; // ¡Importamos el nuevo componente!

const TierListPage = () => {
  // Definimos los datos de nuestras filas
  const tiers = [
    { title: 'S', color: '#ff7f7f' },
    { title: 'A', color: '#ffbf7f' },
    { title: 'B', color: '#ffff7f' },
    { title: 'C', color: '#7fff7f' },
    { title: 'D', color: '#7fbfff' },
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Creador de Tier Lists</h2>
      <AlbumSearch />
      
      <div className="tier-list-container">
        {tiers.map(tier => (
          <TierRow key={tier.title} title={tier.title} color={tier.color} />
        ))}
      </div>
    </div>
  );
};

export default TierListPage;