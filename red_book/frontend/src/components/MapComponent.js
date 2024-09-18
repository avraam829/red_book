import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Polygon, Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Stroke, Fill, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';
import { datapark } from './data'; // Импорт данных

proj4.defs('EPSG:2000', '+proj=tmerc +lat_0=0 +lon_0=37.6173 +k=1 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs');

// Функция для создания полигона
const createPolygonFeature = () => {
  const parkCoords = datapark.map(coord => fromLonLat(coord));
  const parkPolygon = new Polygon([parkCoords]);
  const feature = new Feature({
    geometry: parkPolygon,
  });

  feature.setStyle(
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

  return feature;
};

// Функция для создания слоя с полигоном
const createVectorLayer = () => {
  const vectorSource = new VectorSource({
    features: [createPolygonFeature()],
  });

  return new VectorLayer({
    source: vectorSource,
  });
};

// Функция для создания одной точки
const createPointFeature = (lon, lat) => {
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat([lon, lat])),
  });

  pointFeature.setStyle(
    new Style({
      image: new Icon({
        color: 'blue',
        crossOrigin: 'anonymous',
        src: 'https://openlayers.org/en/latest/examples/data/dot.png',
      }),
    })
  );

  return pointFeature;
};

// Функция для создания слоя с точками
const createPointLayer = () => {
  // Основная точка
  const baseLon = 37.412304;
  const baseLat = 55.746659;

  // Смещения для дополнительных точек
  const offsets = [
    [0.0011, 0.0011], // 10 метров примерно в градусах (примерно)
    [0.0001, -0.0011],
    [-0.0011, 0.0011],
    [-0.0011, -0.0011],
    [0.00015, 0.00015],
  ];

  // Создаем массив всех точек
  const features = [
    createPointFeature(baseLon, baseLat), // Основная точка
    ...offsets.map(offset => createPointFeature(baseLon + offset[0], baseLat + offset[1])),
  ];

  const vectorSource = new VectorSource({
    features: features,
  });

  return new VectorLayer({
    source: vectorSource,
  });
};

const MapComponent = ({ showKadatrZones, showAnimals }) => {
  const mapRef = useRef(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [pointLayer, setPointLayer] = useState(null); // Слой с точками

  useEffect(() => {
    const center = fromLonLat([37.410791130, 55.743688192]);

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: center,
        zoom: 14,
      }),
    });

    // Создаем и добавляем слой с полигонами
    const layer = createVectorLayer();
    setVectorLayer(layer);
    map.addLayer(layer);

    // Создаем и добавляем слой с точками
    const pointLayer = createPointLayer();
    setPointLayer(pointLayer);
    map.addLayer(pointLayer);

    return () => {
      map.setTarget(null); // Очистка карты при размонтировании компонента
    };
  }, []);

  // Управление видимостью слоя с полигонами
  useEffect(() => {
    if (vectorLayer) {
      vectorLayer.setVisible(showKadatrZones);
    }
  }, [showKadatrZones, vectorLayer]);

  // Управление видимостью слоя с точками
  useEffect(() => {
    if (pointLayer) {
      pointLayer.setVisible(showAnimals);
    }
  }, [showAnimals, pointLayer]);

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
