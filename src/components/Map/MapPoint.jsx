import React, { useState } from 'react';
import Tooltip from './Tooltip';

/**
 * Componente MapPoint: Representa un punto interactivo en el mapa.
 * Maneja el hover para mostrar el tooltip y el click para ejecutar el callback.
 * @param {Object} point - Objeto con datos del punto (id, x, y, title, description, image)
 * @param {Function} onPointClick - Callback ejecutado al hacer click en el punto
 */
const MapPoint = ({ point, onPointClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    onPointClick(point);
  };

  return (
    <div
      className="map-point"
      style={{
        position: 'absolute',
        left: `${point.x * 100}%`,
        top: `${point.y * 100}%`,
        transform: 'translate(-50%, -50%)', // Centrar el punto en las coordenadas
        cursor: 'pointer',
        width: '10px',
        height: '10px',
        backgroundColor: 'red', // Estilo básico, puede ser personalizado
        borderRadius: '50%',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
    >
      {showTooltip && <Tooltip point={point} />}
    </div>
  );
};

export default MapPoint;