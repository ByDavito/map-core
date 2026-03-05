import React from 'react';

/**
 * Componente Tooltip: Muestra información del punto en hover.
 * Puede usar contenido personalizado (componente o HTML) o el predeterminado.
 * @param {Object} point - Objeto con datos del punto
 * @param {React.Element} tooltipComponent - Componente React personalizado para el tooltip
 * @param {string} tooltipContent - HTML directo para el tooltip
 * @param {Object} tooltipStyles - Estilos personalizados para el tooltip
 * @param {Function} onMouseEnter - Callback mouse enter
 * @param {Function} onMouseLeave - Callback mouse leave
 */
const Tooltip = ({ point, tooltipComponent, tooltipContent, tooltipStyles, onMouseEnter, onMouseLeave }) => {
  // Componente personalizado tiene prioridad
  if (tooltipComponent) {
    const TooltipContent = tooltipComponent;
    return (
      <div 
        className="tooltip" 
        style={{ position: 'absolute', zIndex: 1000, ...tooltipStyles }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <TooltipContent point={point} />
      </div>
    );
  }

  // HTML directo
  if (tooltipContent) {
    return (
      <div 
        className="tooltip" 
        style={{ position: 'absolute', zIndex: 1000, ...tooltipStyles }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        dangerouslySetInnerHTML={{ __html: tooltipContent }} 
      />
    );
  }

  // Contenido predeterminado
  return (
    <div 
      className="tooltip" 
      style={{ position: 'absolute', zIndex: 1000, ...tooltipStyles }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {point.image && (
        <img
          src={point.image}
          alt={point.title || 'Imagen de la obra'}
        />
      )}
      {point.title && <h4>{point.title}</h4>}
      {point.description && <p>{point.description}</p>}
    </div>
  );
};

export default Tooltip;
