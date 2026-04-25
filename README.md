# @bydavito/map-core

Librería React reutilizable para renderizar mapas interactivos utilizando [MapLibre GL JS](https://maplibre.org/). Diseñada para proyectos que requieren visualización de puntos geográficos con tooltips interactivos y múltiples modos de operación.

![Version](https://img.shields.io/badge/version-1.0.16-blue)
![React](https://img.shields.io/badge/React-18%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Características Principales

- 🎯 **Visualización de puntos geográficos** - Renderiza marcadores interactivos en el mapa
- 🖱️ **Tooltips personalizables** - Muestra información en hover o click
- 🌍 **Múltiples modos de operación** - View, Edit y Free
- 🏙️ **Configuración de ciudades** - Limita el mapa a áreas específicas
- 🎨 **Componentes personalizados** - Marcadores y tooltips totalmente personalizables
- 📱 **Responsivo** - Se adapta a cualquier tamaño de contenedor

## Instalación

```bash
npm install @bydavito/map-core
```

### peerDependencies

Asegúrate de tener React y ReactDOM instalados:

```bash
npm install react react-dom
```

## Uso Básico

### Importación

```jsx
import { Map } from '@bydavito/map-core';
```

### Ejemplo Simple

```jsx
import React from 'react';
import { Map } from '@bydavito/map-core';

const points = [
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
  }
];

function App() {
  return (
    <Map
      points={points}
      width="100%"
      height="500px"
    />
  );
}

export default App;
```

## Props del Componente Map

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `points` | `Array` | `[]` | Array de puntos a renderizar en el mapa |
| `width` | `string` | `"100%"` | Ancho del contenedor del mapa |
| `height` | `string` | `"100%"` | Alto del contenedor del mapa |
| `city` | `Object` | `{ center: [-58.3816, -34.6037], zoom: 14, minZoom: 2, maxZoom: 18, bounds: [[-180, -90], [179.99, 89.99]] }` | Configuración de ciudad/región |
| `mode` | `"preview" \| "edit" \| "free"` | `"preview"` | Modo de operación del mapa |
| `onPointClick` | `Function` | - | Callback ejecutado al hacer click en un punto |
| `onMapClick` | `Function` | - | Callback ejecutado al hacer click en el mapa (solo modo edit) |
| `onZoomChange` | `Function` | - | Callback ejecutado al cambiar el zoom (solo modo edit) |
| `onMapReady` | `Function` | - | Callback ejecutado cuando el mapa está listo |
| `minZoomPreview` | `number` | - | Zoom mínimo para modo preview |
| `markerContent` | `string` | - | HTML para el contenido del marcador |
| `markerComponent` | `React.Component` | - | Componente React personalizado para el marcador |
| `markerStyles` | `Array<string>` | `[]` | Array de URLs de CSS para estilos de marcadores |
| `tooltipComponent` | `React.Component` | - | Componente React personalizado para el tooltip |
| `tooltipContent` | `string` | - | HTML directo para el tooltip |
| `tooltipStyles` | `Object` | - | Estilos personalizados para el tooltip |
| `tooltipOnClick` | `boolean` | `false` | Mostrar tooltip en click en lugar de hover |

## Configuración de Ciudades

El prop `city` permite configurar un área específica del mapa:

```jsx
const cityConfig = {
  center: [-62.00713347625768, -30.710814666119596], // [lng, lat]
  zoom: 16,
  minZoom: 14,
  maxZoom: 16.5,
  bounds: [[-62.05092738905675, -30.74721473871704], [-61.96892272502474, -30.683064572443207]]
};

<Map city={cityConfig} ... />
```

### Ciudades Predefinidas (en App.jsx)

```jsx
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
```

## Modos de Operación

### Modo Preview (`mode="preview"`)
- Mapa estático, sin interacción del usuario
- No permite zoom ni pan
- Ideal para miniaturas o vistas previas
- Oculta los controles de navegación

### Modo Free (`mode="free"`)
- Mapa interactivo con límites de ciudad
- Permite zoom y pan dentro de los bounds definidos
- Control total de navegación

### Modo Edit (`mode="edit"`)
- Mapa interactivo para edición
- Permite agregar puntos al hacer click
- Callback `onMapClick` devuelve las coordenadas `{ lng, lat }`
- Callback `onZoomChange` devuelve `{ zoom, lng, lat }` en cada cambio de zoom

## Estructura de Puntos

Cada punto debe tener la siguiente estructura:

```jsx
const point = {
  id: 'unique-id',           // Identificador único (requerido)
  title: 'Título del punto',  // Título para el tooltip
  description: 'Descripción', // Descripción para el tooltip
  lng: -58.3816,             // Longitud
  lat: -34.6037,             // Latitud
  image: 'url/imagen.jpg'    // (opcional) Imagen para el tooltip
};
```

## Marcadores Personalizados

### Usando markerContent (HTML)

```jsx
<Map
  points={points}
  markerContent={`<div class="custom-marker">🏠</div>`}
/>
```

### Usando markerComponent (Componente React)

```jsx
const CustomMarker = ({ point }) => (
  <div className="my-marker">
    <span>{point.title}</span>
  </div>
);

<Map
  points={points}
  markerComponent={CustomMarker}
/>
```

## Tooltips Personalizados

### Usando tooltipContent (HTML)

```jsx
<Map
  points={points}
  tooltipContent={`<div class="custom-tooltip"><h3>{{point.title}}</h3></div>`}
/>
```

### Usando tooltipComponent (Componente React)

```jsx
const CustomTooltip = ({ point }) => (
  <div className="my-tooltip">
    {point.image && <img src={point.image} alt={point.title} />}
    <h4>{point.title}</h4>
    <p>{point.description}</p>
  </div>
);

<Map
  points={points}
  tooltipComponent={CustomTooltip}
/>
```

### Mostrar Tooltip en Click

```jsx
<Map
  points={points}
  tooltipOnClick={true}  // Tooltip se muestra al hacer click
  onPointClick={(point) => console.log('Punto seleccionado:', point)}
/>
```

## Ejemplo Completo

```jsx
import React, { useState } from 'react';
import { Map } from '@bydavito/map-core';

// Configuración de ciudad
const buenosAires = {
  center: [-58.369564408763196, -34.610857854396585],
  zoom: 12,
  minZoom: 10,
  maxZoom: 18,
  bounds: [[-59.74784465537992, -35.257744036032555], [-57.04102643657643, -34.160276411989614]]
};

// Puntos de ejemplo
const points = [
  {
    id: '1',
    title: 'Casa de la Cultura',
    description: 'Museo de arte contemporáneo',
    lng: -58.3772,
    lat: -34.6070,
  },
  {
    id: '2',
    title: 'Plaza San Martín',
    description: 'Plaza histórica monumental',
    lng: -58.3772,
    lat: -34.6037,
  }
];

// Componente de tooltip personalizado
const CustomTooltip = ({ point }) => (
  <div style={{ padding: '10px', minWidth: '150px' }}>
    {point.image && <img src={point.image} alt={point.title} style={{ width: '100%' }} />}
    <h4 style={{ margin: '5px 0', color: '#e74c3c' }}>{point.title}</h4>
    <p style={{ margin: 0, fontSize: '12px' }}>{point.description}</p>
  </div>
);

function App() {
  const [mode, setMode] = useState('view');

  const handlePointClick = (point) => {
    console.log('Punto clickeado:', point);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        points={points}
        city={buenosAires}
        mode={mode}
        onPointClick={handlePointClick}
        width="100%"
        height="100%"
        tooltipComponent={CustomTooltip}
      />
      <button onClick={() => setMode(mode !== 'edit' ? 'edit' : 'view')}>
        Cambiar a modo {mode !== 'edit' ? 'edición' : 'vista'}
      </button>
    </div>
  );
}

export default App;
```

## Exportaciones del Paquete

```jsx
// Componente Map principal
import { Map } from '@bydavito/map-core';

// Estilo JSON del mapa (para uso avanzado)
import { mapStyle } from '@bydavito/map-core';
import '@bydavito/map-core/style'; // En formato JSON
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Build
npm run build        # Compila la librería para producción

# Linting
npm run lint         # Ejecuta ESLint

# Preview
npm run preview      # Previsualiza el build
```

## Estructura del Proyecto

```
map-core/
├── src/
│   ├── components/
│   │   └── Map/
│   │       ├── Map.jsx        # Componente principal del mapa
│   │       ├── MapPoint.jsx   # Componente de punto/marcador
│   │       ├── Tooltip.jsx    # Componente de tooltip
│   │       ├── Map.css        # Estilos del mapa
│   │       └── Style.json     # Estilo de MapLibre
│   ├── App.jsx                # Componente de ejemplo
│   ├── index.js               # Entry point de exportación
│   └── main.jsx               # Punto de entrada React
├── package.json
├── vite.config.js             # Configuración de Vite
└── README.md
```

## Dependencias

### Dependencies
- `maplibre-gl@^5.17.0` - Librería de mapas

### peerDependencies
- `react@^18.0.0 || ^19.0.0`
- `react-dom@^18.0.0 || ^19.0.0`

### DevDependencies
- `vite@^5.4.1`
- `@vitejs/plugin-react@^5.1.1`
- `eslint@^9.39.1`
- Y otros para linting y типado

## Estilos CSS Incluidos

El componente incluye estilos básicos en `Map.css`:

```css
.map-container       /* Contenedor principal */
.map-markers-container /* Contenedor de marcadores */
.map-point          /* Punto/marcador individual */
.tooltip            /* Contenedor del tooltip */
.tooltip img        /* Imagen del tooltip */
.tooltip h4         /* Título del tooltip */
.tooltip p          /* Descripción del tooltip */
```

## Licencia

MIT License - © 2024 Bydavito

## Autor

Desarrollado por Bydavito - Sistema de Arquitectos
