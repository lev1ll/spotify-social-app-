import React from 'react';
import './TierRow.css'; // Crearemos este CSS

const TierRow = ({ title, color }) => {
  return (
    <div className="tier-row">
      <div className="tier-label" style={{ backgroundColor: color }}>
        {title}
      </div>
      <div className="tier-content">
        {/* Aquí irán las canciones arrastradas */}
      </div>
    </div>
  );
};

export default TierRow;