import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import style from "./Style.json";
import "./Map.css";
import MapPoint from "./MapPoint";

/**
 * Componente Map: Librería React reutilizable para renderizar un mapa interactivo con MapLibre GL JS.
 * Modes: edit (callbacks zoom/coords), free (límites city), preview (miniaturá estática)
 */
const Map = ({
  points = [],
  onPointClick,
  onMapClick,
  onZoomChange,
  width = "100%",
  height = "100%",
  city,
  mode = "preview",
  minZoomPreview,
  markerContent,
  markerComponent: MarkerComponent,
  markerStyles = [], // Array de URLs de CSS o strings de estilos
  tooltipComponent,
  tooltipContent,
  tooltipStyles,
}) => {
  console.log("Map props:", { points: points.length, markerContent, MarkerComponent: typeof MarkerComponent });
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Callback seguro para onPointClick
  const handlePointClick = useCallback((point) => {
    if (typeof onPointClick === 'function') {
      onPointClick(point);
    }
  }, [onPointClick]);

  // Callback seguro para onMapClick
  const handleMapClick = useCallback((e) => {
    if (mode !== "edit" || typeof onMapClick !== 'function') return;
    const { lng, lat } = e.lngLat;
    onMapClick({ lng, lat });
  }, [mode, onMapClick]);

  // Configuración de restricciones según modo
  const restrictions = {
    preview: {
      dragPan: false,
      scrollZoom: false,
      touchZoom: false,
      touchDragPan: false,
      doubleClickZoom: false,
      keyboard: false,
    },
    free: {
      dragPan: true,
      scrollZoom: true,
      touchZoom: true,
      touchDragPan: true,
      doubleClickZoom: true,
      keyboard: true,
    },
    edit: {
      dragPan: true,
      scrollZoom: true,
      touchZoom: true,
      touchDragPan: true,
      doubleClickZoom: true,
      keyboard: true,
    }
  };

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log("Inicializando mapa con city:", city, "| mode:", mode);
      
      // Determinar minZoom según el modo
      const minZoom = mode === "preview" 
        ? (minZoomPreview || city?.minZoom || 5) 
        : (city?.minZoom || 5);
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: style,
        center: city?.center || [-58.3816, -34.6037],
        zoom: mode === "preview" ? city?.minZoom : city?.zoom || 10,
        minZoom: minZoom,
        maxZoom: city?.maxZoom || 18,
        bearing: 0,
        pitch: 0,
        // En preview, ocultar controles de navegación
        ...(mode === "preview" && {
          navigationControl: false,
        }),
      });

      // En preview no agregamos NavigationControl
      if (mode !== "preview") {
        map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      }

      // Desactivar rotación con mouse
      map.current.dragRotate.disable();

      // Desactivar rotación con touch
      map.current.touchZoomRotate.disableRotation();

      map.current.on('load', () => {
        setIsLoaded(true);
        
        // Aplicar restricciones según el modo (dentro de load)
        const config = restrictions[mode] || restrictions.preview;
        
        if (!config.dragPan) map.current.dragPan.disable();
        if (!config.scrollZoom) map.current.scrollZoom.disable();
        if (!config.touchZoom) map.current.touchZoom.disable();
        if (!config.touchDragPan) map.current.touchDragPan.disable();
        if (!config.doubleClickZoom) map.current.doubleClickZoom.disable();
        if (!config.keyboard) map.current.keyboard.disable();

        // Bounds para modo free y edit si city los tiene
        if (city?.bounds && (mode === "free" || mode === "edit")) {
          map.current.setMaxBounds(city.bounds);
        }

        // En modo preview, forzar zoom al minZoom
        if (mode === "preview") {
          map.current.setZoom(minZoom);
        }
      });

      map.current.on('error', (e) => {
        console.error("Error del mapa:", e);
        setError(e.message);
      });

    } catch (err) {
      console.error("Error al crear el mapa:", err);
      setError(err.message);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [city, mode, minZoomPreview]);

  // Manejar marcadores cuando el mapa está cargado
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Contenedor para los marcadores React
    const markersContainer = document.createElement('div');
    markersContainer.className = 'map-markers-container';
    markersContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible;
      z-index: 100;
    `;
    map.current.getCanvasContainer().appendChild(markersContainer);

    // Contenedor separado para tooltips con mayor z-index
    const tooltipsContainer = document.createElement('div');
    tooltipsContainer.className = 'map-tooltips-container';
    tooltipsContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible;
      z-index: 200;
    `;
    map.current.getCanvasContainer().appendChild(tooltipsContainer);

    // Crear root de React para renderizar MapPoints
    const root = ReactDOM.createRoot(markersContainer);
    const tooltipsRoot = ReactDOM.createRoot(tooltipsContainer);

    // Inyectar estilos CSS en el documento si se proporciona markerStyles
    const injectedStyles = [];
    if (markerStyles && markerStyles.length > 0) {
      markerStyles.forEach((styleUrl) => {
        let link = document.querySelector(`link[href="${styleUrl}"]`);
        if (!link) {
          link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = styleUrl;
          document.head.appendChild(link);
          injectedStyles.push(link);
        }
      });
    }

    // Función para obtener posición en pixels
    const updateMarkerPosition = (markerEl, lngLat) => {
      const point = map.current.project(lngLat);
      markerEl.style.left = `${point.x}px`;
      markerEl.style.top = `${point.y}px`;
    };

    // Renderizar MapPoints con React
    const renderMarkers = () => {
      try {
        console.log("renderMarkers called, points:", points.length, "MarkerComponent:", typeof MarkerComponent);
        
        const markerElements = points.map((point) => (
          <MapPoint
            key={point.id || point._id}
            point={point}
            onPointClick={handlePointClick}
            tooltipComponent={tooltipComponent}
            tooltipContent={tooltipContent}
            tooltipStyles={tooltipStyles}
            tooltipContainer={tooltipsContainer}
          >
            {/* Marker Component (React) - prioridad alta */}
            {MarkerComponent ? (
              <MarkerComponent point={point} />
            ) : markerContent ? (
              <div dangerouslySetInnerHTML={{ __html: markerContent }} />
            ) : (
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5" cy="12.5" r="12" fill="#e74c3c" stroke="#c0392b" strokeWidth="2"/>
              </svg>
            )}
          </MapPoint>
        ));

        console.log("markerElements:", markerElements.length);

        root.render(
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {markerElements}
          </div>
        );

        console.log("root.render completed");
      } catch (error) {
        console.error("Error in renderMarkers:", error);
      }
    };

    // Función para actualizar todas las posiciones de markers
    const updateAllPositions = () => {
      const markerEls = markersContainer.querySelectorAll('.map-point');
      points.forEach((point, index) => {
        const lngLat = [point.lng || 0, point.lat || 0];
        if (markerEls[index]) {
          updateMarkerPosition(markerEls[index], lngLat);
        }
      });
    };

    renderMarkers();
    
    // Actualizar posiciones con requestAnimationFrame para asegurar que el DOM esté listo
    const updatePositionsWhenReady = () => {
      const markerEls = markersContainer.querySelectorAll('.map-point');
      if (markerEls.length > 0) {
        updateAllPositions();
      } else {
        // Si los elementos aún no existen, intentar de nuevo en el siguiente frame
        requestAnimationFrame(updatePositionsWhenReady);
      }
    };
    
    requestAnimationFrame(updatePositionsWhenReady);
    
    // También actualizar cuando el mapa esté idle (carga completa)
    map.current.once('idle', () => {
      updateAllPositions();
    });

    map.current.on('move', updateAllPositions);
    map.current.on('zoom', updateAllPositions);

    // Cleanup de marcadores
    return () => {
      if (map.current) {
        map.current.off('move', updateAllPositions);
        map.current.off('zoom', updateAllPositions);
        root.unmount();
        tooltipsRoot.unmount();
        markersContainer.remove();
        tooltipsContainer.remove();
        // Remover estilos injectados
        injectedStyles.forEach(link => link.remove());
      }
    };
  }, [points, isLoaded, handlePointClick, markerContent, MarkerComponent, markerStyles]);

  // Evento de zoom end - solo para modo edit
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    const handleZoomEnd = () => {
      if (mode !== "edit") return;
      
      const zoom = map.current.getZoom();
      const center = map.current.getCenter();
      
      console.log("Zoom end - Mode Edit:", { zoom, lng: center.lng, lat: center.lat });
      
      // Devolver callback con zoom y coordenadas
      if (typeof onZoomChange === 'function') {
        onZoomChange({
          zoom,
          lng: center.lng,
          lat: center.lat
        });
      }
    };

    map.current.on("zoomend", handleZoomEnd);
    map.current.on("click", handleMapClick);

    return () => {
      try {
        if (map.current) {
          map.current.off("zoomend", handleZoomEnd);
          map.current.off("click", handleMapClick);
        }
      } catch (err) {
        console.error("Error al remover eventos:", err);
      }
    };
  }, [isLoaded, mode, handleMapClick, onZoomChange]);

  if (error) {
    return (
      <div className="map-error" style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
        <p style={{ color: 'red' }}>Error al cargar el mapa: {error}</p>
      </div>
    );
  }

  return (
    <div className="map-container" style={{ 
      width, 
      height,
      isolation: 'isolate',
      willChange: 'transform'
    }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
