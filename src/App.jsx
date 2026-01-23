import React, { use, useState } from 'react';
import Map from './components/Map/map.jsx'; // Importar el componente Map

function App() {

  const [mode, setMode] = useState("view"); // Estado para el modo actual
  // Datos de ejemplo para los puntos
  const points = [
    {
      id: 1,
      lng: -58.3816, // Centro de Buenos Aires
      lat: -34.6037,
      title: 'Obra Arquitectónica 1',
      description: 'Descripción breve de la obra 1.',
      image: 'https://via.placeholder.com/150?text=Obra1',
    },
    {
      id: 2,
      lng: -58.3816,
      lat: -34.6137, // Un poco al sur
      title: 'Obra Arquitectónica 2',
      description: 'Descripción breve de la obra 2.',
      image: 'https://via.placeholder.com/150?text=Obra2',
    },
    {
      id: 3,
      lng: -58.3916, // Un poco al oeste
      lat: -34.6037,
      title: 'Obra Arquitectónica 3',
      description: 'Descripción breve de la obra 3.',
      image: 'https://via.placeholder.com/150?text=Obra3',
    },
  ];

  const cities = {
        morteros: {
          center: [-62.00713347625768, -30.710814666119596],
          zoom: 16,
          minZoom: 14,
          maxZoom: 16.5,
          bounds: [[-62.05092738905675, -30.74721473871704], [-61.96892272502474, -30.683064572443207]],
        },
  
        buenosAires: {
          center: [-58.369564408763196, -34.610857854396585],
          zoom: 10,
          minZoom: 10.5,
          maxZoom: 16.5,
          bounds: [[-59.74784465537992, -35.257744036032555], [-57.04102643657643, -34.160276411989614]],
        },

        free: {
          center: [-58.3816, -34.6037], // Centro de Buenos Aires
          zoom: 14,
          minZoom: 2,
          maxZoom: 18,
          bounds: [[-180.0000, -90.0000], [179.9999, 89.9999]], // Mundo entero
        }
    };

  // Callback para el click en punto
  const handlePointClick = (point) => {
    console.log('Punto clickeado:', point);
    alert(`Click en: ${point.title}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        points={points}
        onPointClick={handlePointClick}
        width="100%"
        height="100%"
        city={cities.buenosAires}
        mode={mode}
      />
      <button onClick={ () => { setMode(mode!== "edit" ? "edit" : "view"); console.log(mode); }}>editar</button>
    </div>
  );
}

export default App;
