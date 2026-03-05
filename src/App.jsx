import React, { useState } from 'react';
import Map from './components/Map/map.jsx';

// Configuración de ciudades
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
    center: [-58.3816, -34.6037],
    zoom: 14,
    minZoom: 2,
    maxZoom: 18,
    bounds: [[-180.0000, -90.0000], [179.9999, 89.9999]],
  }
};

// Constante local con puntos de prueba (array)
const testPoints = [
  {
    id: '1',
    title: 'Casa Familiar',
    description: 'Casa familiar en Córdoba',
    lng: -64.1888,
    lat: -31.4201,
  },
  {
    id: '2',
    title: 'Oficina Central',
    description: 'Oficina principal en Buenos Aires',
    lng: -58.3816,
    lat: -34.6037,
  },
  {
    id: '3',
    title: 'Plaza San Martín',
    description: 'Plaza histórica en Buenos Aires',
    lng: -58.3772,
    lat: -34.6070,
  }
];

function App({ points = [], city = '' }) {
  const [mode, setMode] = useState("view");

  // Callback para el click en punto
  const handlePointClick = (point) => {
    console.log('Punto clickeado:', point);
    alert(`Click en: ${point.title}`);
  };

  // Determinar la configuración de ciudad
  const cityConfig = city ? city : cities.free;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        points={points}
        onPointClick={handlePointClick}
        width="100%"
        height="100%"
        city={cityConfig}
        mode={mode}
      />
      <button onClick={() => { setMode(mode !== "edit" ? "edit" : "view"); console.log(mode); }}>editar</button>
    </div>
  );
}

export default App;
