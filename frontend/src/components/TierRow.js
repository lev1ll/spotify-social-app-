import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import './TierRow.css';

const TierRow = ({ id, title, color, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="tier-row" ref={setNodeRef}>
      <div className="tier-label" style={{ backgroundColor: color }}>
        {title}
      </div>
      <div className="tier-content">
        {children} {/* Aquí mostraremos las canciones arrastradas */}
      </div>
    </div>
  );
};

export default TierRow;