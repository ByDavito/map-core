import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip';

/**
 * Componente MapPoint: Representa un punto interactivo en el mapa.
 * Maneja el hover para mostrar el tooltip y el click para ejecutar el callback.
 * @param {Object} point - Objeto con datos del punto (id, x, y, title, description, image)
 * @param {Function} onPointClick - Callback ejecutado al hacer click en el punto
 * @param {React.Element} tooltipComponent - Componente React personalizado para el tooltip
 * @param {string} tooltipContent - HTML directo para el tooltip
 * @param {Object} tooltipStyles - Estilos personalizados para el tooltip
 * @param {HTMLElement} tooltipContainer - Contenedor separado para el tooltip
 */
const MapPoint = ({ point, onPointClick, children, tooltipComponent, tooltipContent, tooltipStyles, tooltipContainer }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    onPointClick(point);
  };

  const handleMouseEnter = (e) => {
    setShowTooltip(true);
    // Calcular posición del marker para posicionar el tooltip
    const markerEl = e.currentTarget;
    const rect = markerEl.getBoundingClientRect();
    const mapContainer = markerEl.closest('.map-container');
    if (mapContainer) {
      const mapRect = mapContainer.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left - mapRect.left + rect.width / 2,
        y: rect.top - mapRect.top
      });
    }
  };

  const handleMouseLeave = () => setShowTooltip(false);

  // Renderizar tooltip en portal si hay un contenedor separado
  const renderTooltip = () => {
    if (!showTooltip) return null;
    
    const tooltipElement = (
      <Tooltip 
        point={point}
        tooltipComponent={tooltipComponent}
        tooltipContent={tooltipContent}
        tooltipStyles={{
          ...tooltipStyles,
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );

    if (tooltipContainer) {
      return ReactDOM.createPortal(tooltipElement, tooltipContainer);
    }
    return tooltipElement;
  };

  return (
    <div
      className="map-point"
      style={{
        position: "absolute" ,
          left: "0" ,
          top: "0" ,
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'auto'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {/* Tooltip renderizado inline si no hay contenedor separado */}
      {!tooltipContainer && showTooltip && (
        <Tooltip 
          point={point}
          tooltipComponent={tooltipComponent}
          tooltipContent={tooltipContent}
          tooltipStyles={tooltipStyles}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      {/* Tooltip renderizado en portal si hay contenedor separado */}
      {tooltipContainer && renderTooltip()}
    </div>
  );
};

export default MapPoint;
