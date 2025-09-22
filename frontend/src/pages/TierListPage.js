import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
// ... (imports se mantienen)
import AlbumSearch from '../components/AlbumSearch';
import TierRow from '../components/TierRow';
import TracksBank from '../components/TracksBank';
import DraggableTrack from '../components/DraggableTrack';
import './TierListPage.css';

const TierListPage = ({ token }) => {
  // ... (toda la lógica de estado y funciones se mantiene exactamente igual)
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [tracksBank, setTracksBank] = useState([]);
  const [columns, setColumns] = useState({ S: { name: 'S', items: [], color: '#ff7f7f' }, A: { name: 'A', items: [], color: '#ffbf7f' }, B: { name: 'B', items: [], color: '#ffff7f' }, C: { name: 'C', items: [], color: '#7fff7f' }, D: { name: 'D', items: [], color: '#7fbfff' }, });
  const [activeDragItem, setActiveDragItem] = useState(null);
  const handleAlbumSelect = (album) => { if (!selectedAlbums.find(a => a.id === album.id)) { setSelectedAlbums(prev => [...prev, album]); } setActiveAlbumId(album.id); };
  useEffect(() => { const fetchTracks = async () => { if (!activeAlbumId) { setTracksBank([]); return; } const response = await fetch(`http://127.0.0.1:5000/album-tracks/${activeAlbumId}`, { headers: { 'Authorization': `Bearer ${token}` } }); const data = await response.json(); const album = selectedAlbums.find(a => a.id === activeAlbumId); const tracksWithAlbumInfo = (data.items || []).map(track => ({ ...track, album })); setTracksBank(tracksWithAlbumInfo); }; fetchTracks(); }, [activeAlbumId, token, selectedAlbums]);
  const findContainer = (id) => { if (tracksBank.some(item => item.id === id)) return 'bank'; for (const colId in columns) { if (columns[colId].items.some(item => item.id === id)) return colId; } return null; };
  const handleDragStart = (event) => { const { active } = event; const container = findContainer(active.id); if (container === 'bank') { setActiveDragItem(tracksBank.find(item => item.id === active.id)); } else if (container) { setActiveDragItem(columns[container].items.find(item => item.id === active.id)); } };
  const handleDragEnd = (event) => { const { active, over } = event; if (!over) { setActiveDragItem(null); return; } const activeContainerId = findContainer(active.id); const overContainerId = over.id; if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) { setActiveDragItem(null); return; } let draggedItem; if (activeContainerId === 'bank') { const activeItems = [...tracksBank]; const draggedItemIndex = activeItems.findIndex(item => item.id === active.id); [draggedItem] = activeItems.splice(draggedItemIndex, 1); setTracksBank(activeItems); } else { const activeItems = [...columns[activeContainerId].items]; const draggedItemIndex = activeItems.findIndex(item => item.id === active.id); [draggedItem] = activeItems.splice(draggedItemIndex, 1); setColumns(prev => ({ ...prev, [activeContainerId]: { ...prev[activeContainerId], items: activeItems } })); } if (overContainerId === 'bank') { setTracksBank(prev => [...prev, draggedItem]); } else { const overItems = [...columns[overContainerId].items]; overItems.push(draggedItem); setColumns(prev => ({ ...prev, [overContainerId]: { ...prev[overContainerId], items: overItems } })); } setActiveDragItem(null); };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="tierlist-page-container">
        <h2>Creador de Tier Lists</h2>
        <div className="tierlist-main-content">
          <div className="left-column">
            
            {/* Contenedor Fijo para Búsqueda y Resultados */}
            <div className="search-section">
              <AlbumSearch token={token} onAlbumSelect={handleAlbumSelect} />
            </div>

            {/* Contenedor Fijo para Álbumes Seleccionados y Banco */}
            <div className="selection-section">
              <div className="selected-albums-container">
                {selectedAlbums.map(album => ( <img key={album.id} src={album.images[0]?.url} alt={album.name} className={`album-cover ${album.id === activeAlbumId ? 'active' : ''}`} onClick={() => setActiveAlbumId(album.id)} /> ))}
              </div>
              <TracksBank id="bank" tracks={tracksBank} />
            </div>

          </div>
          <div className="right-column">
            {/* ... (código de la columna derecha se mantiene igual) ... */}
            <div className="tier-list-container">
              {Object.entries(columns).map(([id, col]) => (
                <TierRow key={id} id={id} title={col.name} color={col.color}>
                  {col.items.map(track => <DraggableTrack key={track.id} track={track} />)}
                </TierRow>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ... (DragOverlay se mantiene igual) ... */}
    </DndContext>
  );
};
export default TierListPage;