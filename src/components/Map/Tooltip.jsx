import React from 'react';

/**
 * Componente Tooltip: Muestra información básica del punto en hover.
 * Renderiza una imagen, título y descripción en un contenedor flotante.
 * @param {Object} point - Objeto con datos del punto (title, description, image)
 */
const Tooltip = ({ point }) => {
  return (
    <div
      className="tooltip"
      style={{
        position: 'absolute',
        bottom: '100%', // Posicionar arriba del punto
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10,
        maxWidth: '200px',
        textAlign: 'center',
      }}
    >
      <img
        src={point.image}
        alt={point.title}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '100px',
          objectFit: 'cover',
        }}
      />
      <h4 style={{ margin: '4px 0', fontSize: '14px' }}>{point.title}</h4>
      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{point.description}</p>
    </div>
  );
};

export default Tooltip;