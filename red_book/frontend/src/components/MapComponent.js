import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Stroke, Fill } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';
import { datapark } from './data'; // Import data from data.js

proj4.defs('EPSG:2000', '+proj=tmerc +lat_0=0 +lon_0=37.6173 +k=1 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs');

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

const createVectorLayer = () => {
  const vectorSource = new VectorSource({
    features: [createPolygonFeature()],
  });

  return new VectorLayer({
    source: vectorSource,
  });
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);

  useEffect(() => {
    const center = fromLonLat([37.410791130, 55.743688192]);

    const newMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        createVectorLayer(),
      ],
      view: new View({
        center: center,
        zoom: 14,
      }),
    });

    setMap(newMap);
    setVectorLayer(createVectorLayer());

    return () => {
      newMap.setTarget(null); // Cleanup map
    };
  }, []);

  // Example function to show/hide vector layer
  const toggleVectorLayer = () => {
    if (map && vectorLayer) {
      const isVisible = vectorLayer.getVisible();
      vectorLayer.setVisible(!isVisible);
    }
  };

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
      <button onClick={toggleVectorLayer}>Toggle Polygon Layer</button>
    </div>
  );
};

export default MapComponent;
