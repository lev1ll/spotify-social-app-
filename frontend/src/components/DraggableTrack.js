import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './DraggableTrack.css';

// Ahora recibe 'album' como una nueva prop
const DraggableTrack = ({ track, album }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: track.id,
    data: { track, album }, // Podemos pasar ambos datos
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined;

  // Usamos el 'album' que recibimos para encontrar la imagen
  const imageUrl = album?.images[0]?.url;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="track-card"
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={track.name} 
          className="track-card-image"
          draggable="false" 
        />
      )}
      <span className="track-card-name">{track.name}</span>
    </div>
  );
};

export default DraggableTrack;