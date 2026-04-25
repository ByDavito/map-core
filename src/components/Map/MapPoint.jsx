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
const MapPoint = ({ point, onPointClick, children, tooltipComponent, tooltipContent, tooltipStyles, tooltipContainer, tooltipOnClick = false, activeTooltipId, onTooltipOpen }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltipHover, setShowTooltipHover] = useState(false);

  // Determinar si mostrar tooltip basado en tooltipOnClick y activeTooltipId
  const showTooltip = tooltipOnClick 
    ? activeTooltipId === point.id 
    : showTooltipHover; // En modo hover, usar estado interno

  const handleClick = (e) => {
    e.stopPropagation();
    // Si tooltipOnClick es true, toggle tooltip al hacer click
    if (tooltipOnClick) {
      if (activeTooltipId === point.id) {
        // Si ya está abierto, cerrar
        if (onTooltipOpen) {
          onTooltipOpen(null);
        }
      } else {
        // Si no está abierto, abrir y notificar al padre
        if (onTooltipOpen) {
          onTooltipOpen(point.id);
        }
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
      }
    }
    // Ejecutar callback original si existe
    if (onPointClick) {
      onPointClick(point);
    }
  };

  const handleMouseEnter = (e) => {
    // Solo mostrar tooltip en hover si tooltipOnClick es false
    if (!tooltipOnClick) {
      setShowTooltipHover(true);
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
    }
  };

  const handleMouseLeave = () => {
    // Solo ocultar tooltip en hover si tooltipOnClick es false
    if (!tooltipOnClick) {
      setShowTooltipHover(false);
    }
  };

  // Función para cerrar el tooltip (llamada desde el padre)
  const closeTooltip = () => {
    if (onTooltipOpen) {
      onTooltipOpen(null);
    }
  };

  // Renderizar tooltip inline como hijo del marker para que se mueva con el mapa
  const renderTooltip = () => {
    if (!showTooltip) return null;
    
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Tooltip 
          point={point}
          tooltipComponent={tooltipComponent}
          tooltipContent={tooltipContent}
          tooltipStyles={tooltipStyles}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    );
  };

  // El marker activo (con tooltip mostrado) debe tener z-index alto para estar por encima de otros markers
  const markerStyle = {
    position: "absolute",
    left: "0",
    top: "0",
    transform: 'translate(-50%, -100%)',
    pointerEvents: 'auto',
    zIndex: showTooltip ? 99999 : 1
  };

  return (
    <div
      className="map-point"
      style={markerStyle}
      onMouseEnter={!tooltipOnClick ? handleMouseEnter : undefined}
      onMouseLeave={!tooltipOnClick ? handleMouseLeave : undefined}
      onClick={handleClick}
    >
      {children}
      {/* Tooltip renderizado inline en el contenedor del marker */}
      {renderTooltip()}
    </div>
  );
};

export default MapPoint;
