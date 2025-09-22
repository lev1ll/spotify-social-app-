import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TrackRow from './TrackRow';
import './TracksBank.css';

const TracksBank = ({ id, tracks }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div className="tracks-bank-container">
      <h3>Banco de Canciones</h3>
      <div ref={setNodeRef} className="tracks-bank-list">
        {tracks.map(track => (
          <TrackRow key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};
export default TracksBank;