import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './TrackRow.css'; // ¡Nuevo CSS!

const TrackRow = ({ track }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: track.id,
    data: { track },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="track-row">
      <span className="track-number">{track.track_number}.</span>
      <span className="track-name">{track.name}</span>
      {/* Aquí podemos añadir el botón de play en el futuro */}
    </div>
  );
};

export default TrackRow;