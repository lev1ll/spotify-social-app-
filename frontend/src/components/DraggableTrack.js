import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './DraggableTrack.css';

const DraggableTrack = ({ track, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: track.id,
    data: { track },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Si es el clon que se arrastra (overlay), no necesita los listeners
  const eventHandlers = isOverlay ? {} : listeners;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...eventHandlers} className="track-card">
      <img src={track.album?.images[0]?.url} alt={track.name} className="track-card-image" draggable="false" />
      <span className="track-card-name">{track.name}</span>
    </div>
  );
};
export default DraggableTrack;