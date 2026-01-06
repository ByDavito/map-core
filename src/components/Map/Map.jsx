import React from 'react';
import MapPoint from './MapPoint';
import './Map.css';

/**
 * Componente Map: Librería React reutilizable para renderizar un mapa con puntos interactivos.
 *
 * Decisiones clave:
 * - Usa position: relative en el contenedor para posicionar puntos absolutamente con coordenadas relativas (0-1).
 * - La imagen del mapa escala con object-fit: contain para mantener proporciones sin distorsión.
 * - Puntos se centran en sus coordenadas con transform: translate(-50%, -50%).
 * - No maneja estado global ni efectos secundarios; delega lógica de negocio al callback onPointClick.
 * - Estilos modulares en CSS separado para reutilización y mantenibilidad.
 * - Sin dependencias externas para mantener ligereza y compatibilidad.
 *
 * @param {string} backgroundImage - URL de la imagen del mapa (plano de ciudad o localidad).
 * @param {Array} points - Array de objetos con datos de puntos: {id, x, y, title, description, image}.
 * @param {Function} onPointClick - Callback ejecutado al hacer click en un punto, recibe el objeto point.
 * @param {number|string} width - Ancho del mapa (puede ser número en px o string como '100%').
 * @param {number|string} height - Alto del mapa (puede ser número en px o string como '100%').
 */
const Map = ({ backgroundImage, points = [], onPointClick }) => {
  // Validación básica: asegurar que onPointClick sea una función
  if (typeof onPointClick !== 'function') {
    console.warn('Map: onPointClick debe ser una función');
  }

  return (
    <div
      className="map-container"
      
    >
      <img
        src={backgroundImage}
        alt="Mapa base"
        className="map-image"
      />
      {points.map((point) => (
        <MapPoint
          key={point.id}
          point={point}
          onPointClick={onPointClick}
        />
      ))}
    </div>
  );
};

export default Map;