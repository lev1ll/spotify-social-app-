import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableTrack = ({ track }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: track.id,
    data: { track }, // Adjuntamos todos los datos de la canción
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="track-item" // Reutilizamos el estilo del cajón
    >
      {track.name}
    </div>
  );
};

export default DraggableTrack;