import React from 'react';
import Map from './index.js'; // Importar el componente Map desde la librería
import mapImg from '../src/img/map.svg'; // Asegúrate de tener una imagen de mapa en esta ruta

function App() {
  // Datos de ejemplo para los puntos
  const points = [
    {
      id: 1,
      x: 0.5, // 20% desde la izquierda
      y: 0.3, // 30% desde arriba
      title: 'Obra Arquitectónica 1',
      description: 'Descripción breve de la obra 1.',
      image: 'https://via.placeholder.com/150?text=Obra1',
    },
    {
      id: 2,
      x: 0.5,
      y: 0.6,
      title: 'Obra Arquitectónica 2',
      description: 'Descripción breve de la obra 2.',
      image: 'https://via.placeholder.com/150?text=Obra2',
    },
    {
      id: 3,
      x: 0.57,
      y: 0.4,
      title: 'Obra Arquitectónica 3',
      description: 'Descripción breve de la obra 3.',
      image: 'https://via.placeholder.com/150?text=Obra3',
    },
  ];

  // Callback para el click en punto
  const handlePointClick = (point) => {
    console.log('Punto clickeado:', point);
    alert(`Click en: ${point.title}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        backgroundImage={mapImg} // Ruta a la imagen del mapa
        points={points}
        onPointClick={handlePointClick}
        width="80%"
        height="70%"
      />
    </div>
  );
}

export default App;
