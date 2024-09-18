import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Stroke, Fill } from 'ol/style';
import { fromLonLat } from 'ol/proj';

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Центр карты (Москва)
    const center = fromLonLat([37.6173, 55.7558]);

    // Координаты для полигона вокруг Кремля
    const kremlinCoords = [
      [
        [37.6166, 55.7516], // Точки полигона
        [37.6205, 55.7526],
        [37.6222, 55.7520],
        [37.6186, 55.7505],
        [37.6166, 55.7516],
      ].map(coord => fromLonLat(coord)),
    ];

    // Создание полигона
    const kremlinPolygon = new Feature({
      geometry: new Polygon(kremlinCoords),
    });

    // Стиль для полигона
    kremlinPolygon.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'red',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.2)',
        }),
      })
    );

    // Векторный источник для полигона
    const vectorSource = new VectorSource({
      features: [kremlinPolygon],
    });

    // Слой векторного объекта
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Создание карты
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: center,
        zoom: 14, // Зум для Москвы
      }),
    });

    return () => {
      map.setTarget(null); // Очистка карты
    };
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
    </div>
  );
};

export default MapComponent;
