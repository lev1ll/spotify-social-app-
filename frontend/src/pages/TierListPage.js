import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import AlbumSearch from '../components/AlbumSearch';
import TierRow from '../components/TierRow';
import DraggableTrack from '../components/DraggableTrack';

const TierListPage = ({ token }) => {
  const [columns, setColumns] = useState({
    pending: { name: 'Canciones Pendientes', items: [] },
    S: { name: 'S', items: [], color: '#ff7f7f' },
    A: { name: 'A', items: [], color: '#ffbf7f' },
    B: { name: 'B', items: [], color: '#ffff7f' },
    C: { name: 'C', items: [], color: '#7fff7f' },
    D: { name: 'D', items: [], color: '#7fbfff' },
  });

  const handleAlbumSelect = async (albumId) => {
    const response = await fetch(`http://127.0.0.1:5000/album-tracks/${albumId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setColumns(prev => ({ ...prev, pending: { ...prev.pending, items: data.items || [] } }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // Si se suelta fuera de una zona, no hacer nada

    const activeContainer = findContainer(active.id);
    const overContainer = over.id;

    if (activeContainer && overContainer && activeContainer !== overContainer) {
      setColumns(prev => {
        const activeItems = [...prev[activeContainer].items];
        const overItems = [...prev[overContainer].items];
        
        const [draggedItem] = activeItems.splice(activeItems.findIndex(item => item.id === active.id), 1);
        overItems.push(draggedItem);

        return {
          ...prev,
          [activeContainer]: { ...prev[activeContainer], items: activeItems },
          [overContainer]: { ...prev[overContainer], items: overItems },
        };
      });
    }
  };
  
  const findContainer = (itemId) => {
    return Object.keys(columns).find(key => columns[key].items.some(item => item.id === itemId));
  };
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Creador de Tier Lists</h2>
        <AlbumSearch token={token} onAlbumSelect={handleAlbumSelect} />
        
        {/* Cajón de Pendientes */}
        <TierRow id="pending" title="Pendientes" color="#535a68">
          {columns.pending.items.map(track => <DraggableTrack key={track.id} track={track} />)}
        </TierRow>

        <div className="tier-list-container">
          {Object.entries(columns).filter(([id]) => id !== 'pending').map(([id, col]) => (
            <TierRow key={id} id={id} title={col.name} color={col.color}>
              {col.items.map(track => <DraggableTrack key={track.id} track={track} />)}
            </TierRow>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default TierListPage;