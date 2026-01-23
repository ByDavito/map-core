import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import style from "./Style.json";
import "./Map.css";

/**
 * Componente Map: Librería React reutilizable para renderizar un mapa interactivo con MapLibre GL JS.
 *
 * Decisiones clave:
 * - Usa MapLibre GL JS para mapas interactivos con zoom y pan nativos.
 * - Puntos se representan como marcadores con popups para tooltips.
 * - Centro y zoom iniciales configurables por ciudad.
 * - Estilos modulares en CSS separado.
 * - Delega lógica de negocio al callback onPointClick.
 *
 * @param {Array} points - Array de objetos con datos de puntos: {id, lng, lat, title, description, image}.
 * @param {Function} onPointClick - Callback ejecutado al hacer click en un marcador, recibe el objeto point.
 * @param {number|string} width - Ancho del mapa (puede ser número en px o string como '100%').
 * @param {number|string} height - Alto del mapa (puede ser número en px o string como '100%').
 * @param {Object} city - Configuración de la ciudad: {center: [lng, lat], zoom, minZoom, maxZoom, bounds: [[lng, lat], [lng, lat]]}.
 */
const Map = ({
  points = [],
  onPointClick,
  width = "100%",
  height = "100%",
  city,
  mode,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Validación básica: asegurar que onPointClick sea una función
  if (typeof onPointClick !== "function") {
    console.warn("Map: onPointClick debe ser una función");
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style, // Estilo personalizado con calles y ciudades
      center: city.center,
      zoom: city.zoom,
      minZoom: city.minZoom,
      maxZoom: city.maxZoom,
      bearing: 0,
      pitch: 0,
    });

    // Desactivar rotación con mouse
    map.current.dragRotate.disable();

    // Desactivar rotación con touch
    map.current.touchZoomRotate.disableRotation();

    map.current.on("load", () => {
      map.current.setMaxBounds(city.bounds);
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores anteriores
    const markers = [];
    points.forEach((point) => {
      const marker = new maplibregl.Marker()
        .setLngLat([point.lng, point.lat])
        .addTo(map.current);

      // Crear popup
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
        `<h3>${point.title}</h3><p>${point.description}</p><img src="${point.image}" alt="${point.title}" style="width:100px;"/>`,
      );

      marker.setPopup(popup);

      // Evento de click
      marker.getElement().addEventListener("click", () => {
        onPointClick(point);
      });

      markers.push(marker);
    });

    const handleZoomEnd = () => {
      if (mode !== "edit") return;
      const zoom = map.current.getZoom();
      console.log("Zoom final:", zoom);
    };

    const handleClick = (e) => {
      if (mode !== "edit") return; // 👈 controlás acá
      const { lng, lat } = e.lngLat;
      console.log(lng, lat);
    };

    map.current.on("zoomend", handleZoomEnd);
    map.current.on("click", handleClick);

    // Cleanup function
    return () => {
      markers.forEach((marker) => marker.remove());
      map.current.off("zoomend", handleZoomEnd);
      map.current.off("click", handleClick);
    };
  }, [points, onPointClick]);

  console.log("Inicializando mapa..." + city);

  return (
    <div className="map-container" style={{ width, height }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
